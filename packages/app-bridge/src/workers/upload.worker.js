/* (c) Copyright Frontify Ltd., all rights reserved. */

let files = [];
let filesMetadata = [];
let filesMetadataAdd = [];
let progress = [];
let progressAll = {
    loaded: 0,
    total: 0,
};
const uploadChunkQueue = [];
let isUploading = false;

// @TODO implement parallel uploads (e.g. 4 workers)
// @see https://github.com/cinely/mule-uploader/blob/master/src/mule-uploader.js

function consumeNextUploadFromQueue() {
    // Abort early if there is nothing left to do
    if (uploadChunkQueue.length <= 0) {
        return;
    }

    // Start the next pending upload
    uploadChunkQueue.shift().start();
}

function upload(data, chunk) {
    const xhr = new XMLHttpRequest();

    try {
        xhr.upload.onprogress = function (event) {
            progressAll.loaded += event.loaded - progress[data.index][data.chunk].loaded;
            progress[data.index][data.chunk].loaded = event.loaded;

            // Calculate loaded bytes of single file considering chunks
            let loaded = 0;

            // eslint-disable-next-line unicorn/no-array-for-each
            progress[data.index].forEach((chunkProgress) => {
                loaded += chunkProgress.loaded;
            });

            self.postMessage({
                event: 'onProgress',
                loaded,
                total: data.total,
                lengthComputable: event.lengthComputable,
                index: data.index,
            });

            self.postMessage({
                event: 'onProgressAll',
                loaded: progressAll.loaded,
                total: progressAll.total,
            });
        };
    } catch (error) {
        // IE11 xhr.upload.onprogress seems to be not supported within web-workers
        // Omit file progress and just send overall progress
        xhr.onprogress = function (event) {
            self.postMessage({
                event: 'onProgressAll',
                loaded: event.loaded,
                total: event.total,
            });
        };
    }

    xhr.open('PUT', data.url, true);
    xhr.onload = function () {
        progress[data.index][data.chunk].finished = true;
        let finished = true;
        for (let p = 1; p < progress[data.index].length; p++) {
            if (!progress[data.index][p].finished) {
                finished = false;
            }
        }

        if (finished) {
            files[data.index].finished = true;
            const xhr2 = new XMLHttpRequest();
            xhr2.open('POST', `${self.location.origin}/api/file/progress`, true);
            xhr2.setRequestHeader('content-type', 'application/json');
            xhr2.onload = function () {
                let response;

                try {
                    response = JSON.parse(xhr2.responseText);
                } catch {
                    response = {};
                }

                response.event = 'onDone';
                response.index = data.index;

                self.postMessage(response);

                // Process next file
                process();
            };
            xhr2.send(JSON.stringify(data));
        }

        // Start the next chunk upload
        consumeNextUploadFromQueue();
    };

    return {
        start() {
            xhr.send(chunk);
        },
    };
}

function init() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${self.location.origin}/api/file/init`, true);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
        let response;

        try {
            response = JSON.parse(xhr.responseText);
        } catch {
            response = { success: false };
        }

        if (!response.success || !(response.files && response.files.length > 0)) {
            self.postMessage({ event: 'onFail' });
            return;
        }

        filesMetadata = filesMetadata.concat(response.files);

        // Only start processing if there are no ongoing uploads
        if (!isUploading) {
            isUploading = true;
            process();
        }
    };
    xhr.send(JSON.stringify({ files: filesMetadataAdd }));
}

function process() {
    // Sequential upload
    let found = false;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!found && !file.finished) {
            found = true;
            processFile(i, files[i], filesMetadata[i]);
        }
    }

    if (!found) {
        // Reset everything after the last upload
        reset();
    }
}

function processFile(index, file, fileMetadata) {
    if (typeof fileMetadata !== 'object') {
        error(index, file, {});
        return;
    }

    if (!fileMetadata.success) {
        error(index, file, fileMetadata);
        return;
    }

    progress[index] = [];
    const blob = file;
    const BYTES_PER_CHUNK = 15 * 1024 * 1024;
    const SIZE = blob.size;
    let start = 0;
    let end = BYTES_PER_CHUNK;
    let chunkNr = 1;

    while (start < SIZE) {
        const chunk = blob.slice(start, end);
        progress[index][chunkNr] = { finished: false, loaded: 0 };
        uploadChunkQueue.push(
            upload(
                {
                    index,
                    start,
                    upload: fileMetadata.upload,
                    object: fileMetadata.object,
                    url: fileMetadata.upload.urls[chunkNr],
                    more: end < SIZE,
                    end: Math.min(end, SIZE - 1),
                    total: SIZE,
                    chunk: chunkNr,
                },
                chunk,
            ),
        );
        start = end;
        end = start + BYTES_PER_CHUNK;
        chunkNr++;
    }

    // Upload at most 4 chunks in parallel
    for (let i = 0; i < 4; i++) {
        consumeNextUploadFromQueue();
    }
}

function error(index, file, fileMetadata) {
    const error = fileMetadata?.error ?? 'Unable to process file.';

    self.postMessage({
        event: 'onFileFail',
        index,
        file,
        file_metadata: fileMetadata,
        error,
    });

    isUploading = false;
    file.finished = true;

    // Process next file
    process();
}

function reset() {
    files = [];
    filesMetadata = [];
    filesMetadataAdd = [];
    progress = [];
    progressAll = {
        loaded: 0,
        total: 0,
    };
    isUploading = false;

    self.postMessage({
        event: 'onDoneAll',
    });
}

self.onmessage = function (event) {
    // Allows to add files during ongoing uploads
    filesMetadataAdd = [];

    for (let index = 0; index < event.data.files.length; index++) {
        const file = event.data.files[index];
        let metadata = {
            name: file.name,
            size: file.size,
            type: file.type,
        };

        if (typeof String.prototype.normalize === 'function') {
            metadata.name = metadata.name.normalize('NFC');
        }

        progressAll.total += file.size;

        if (event.data.formData) {
            metadata = { ...metadata, ...event.data.formData[index] };
        }

        files.push(file);
        filesMetadataAdd.push(metadata);
    }

    init();
};
