import React from 'react';

const FileUpload = ({ label, accept, onChange, id }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                type="file"
                id={id}
                accept={accept}
                onChange={onChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary/10 file:text-primary
          hover:file:bg-primary/20
          cursor-pointer bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
            />
        </div>
    );
};

export default FileUpload;
