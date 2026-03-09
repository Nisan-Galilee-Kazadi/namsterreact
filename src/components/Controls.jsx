import React from 'react';

const Controls = ({ settings, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...settings, [name]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                <select
                    name="fontFamily"
                    value={settings.fontFamily}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10 border bg-white"
                >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille (px)</label>
                <input
                    type="number"
                    name="fontSize"
                    value={settings.fontSize}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        name="color"
                        value={settings.color}
                        onChange={handleChange}
                        className="h-10 w-10 p-0 border-0 rounded overflow-hidden cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">{settings.color}</span>
                </div>
            </div>
        </div>
    );
};

export default Controls;
