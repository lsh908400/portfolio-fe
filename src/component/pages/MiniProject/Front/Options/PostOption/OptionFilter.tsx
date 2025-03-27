import React from 'react'

interface OptionFilterProps {
    optionGroups : any,
    handleFilterChange : any,
}

const OptionFilter : React.FC<OptionFilterProps> = ({optionGroups,handleFilterChange}) => {
    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">옵션 필터</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionGroups.map((group : any) => (
                <div key={group.id} className="border p-3 rounded-md bg-white">
                <h4 className="font-medium mb-2">{group.name}</h4>
                <div className="flex flex-wrap gap-2">
                    {group.values.map((value : any) => (
                    <label key={value.id} className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        onChange={(e) => handleFilterChange(group.id, value.id, e.target.checked)}
                        className="rounded"
                        />
                        <span>{value.value}</span>
                    </label>
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default OptionFilter;
