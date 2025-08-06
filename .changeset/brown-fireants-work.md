---
"@frontify/guideline-blocks-settings": major
---

refactor(\*): replace deprecated fondue components

### Breaking Changes

-   **`AttachmentsProps`**

    -   `triggerComponent` type changed from:
        ```ts
        triggerComponent?: (props: AttachmentsTriggerProps) => ReactElement;
        ```
        to:
        ```ts
        triggerComponent?: React.ForwardRefExoticComponent<
            AttachmentsTriggerProps & React.RefAttributes<HTMLButtonElement>
        >;
        ```

-   **`AttachmentTriggerProps`**

    -   Removed:
        ```ts
        triggerProps: HTMLAttributes<HTMLButtonElement>;
        triggerRef: MutableRefObject<HTMLButtonElement>;
        ```

-   **`LinkInput`**

    -   Removed props:
        ```ts
        openInNewTab?: boolean;
        clearable?: boolean;
        ```
    -   Changed:
        ```ts
        buttonSize?: 'small' | 'medium' | 'large'; // was: buttonSize?: ButtonSize;
        newTab?: boolean; // was: newTab?: CheckboxState;
        ```

-   **`LinkSelector`**

    -   Changed:
        ```ts
        buttonSize?: 'small' | 'medium' | 'large'; // was: buttonSize?: ButtonSize;
        ```

-   **`InsertModalDispatchType` & `InsertModalStateProps`**
    -   Changed:
        ```ts
        newTab?: boolean; // was: newTab?: CheckboxState;
        ```
