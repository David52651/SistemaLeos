import { forwardRef } from "react";                        
import ReactQuill from "react-quill-new";                 
import "react-quill-new/dist/quill.snow.css";              

import PropTypes from "prop-types";


const RichTextEditor = forwardRef(({                   
    label,
    error,
    value,
    onChange,
    placeholder = "",
    className = "",
    required = false,
    disabled = false,
}, ref) => {

    const modules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],       // (color de texto + color de fondo)
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote"],
        ["clean"],
    ],
};

const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "color",                                     
    "background",                                  
    "list",
    "blockquote",
];

    return (
        <div className={`form-group ${className}`}>

            {label && (
                <label className={`form-label ${required ? "required" : ""}`}>
                    {label}
                </label>
            )}

            <ReactQuill
                ref={ref}
                theme="snow"
                value={value || ""}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                readOnly={disabled}
                className="rich-text-editor"
            />

            {error && <span className="form-error">{error}</span>}

        </div>
    );
});

RichTextEditor.displayName = "RichTextEditor";

RichTextEditor.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default RichTextEditor;