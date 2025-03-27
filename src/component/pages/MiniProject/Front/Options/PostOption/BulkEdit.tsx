import React from 'react'

interface BulkEditProps {
    bulkEditMode : boolean,
    bulkEditField : any,
    setBulkEditField : any,
    bulkEditValue : any,
    setBulkEditValue : any,
    applyBulkEdit : any,
    selectedCombinations : any,
}

const BulkEdit : React.FC<BulkEditProps> = ({bulkEditField,bulkEditMode,setBulkEditField,bulkEditValue,setBulkEditValue,applyBulkEdit,selectedCombinations}) => {
    return (
        <>
            {bulkEditMode && (
            <div className="mt-3 p-3 border rounded-md bg-gray-50 flex items-center space-x-4">
                <label className="font-medium">편집 대상:</label>
                <select
                    value={bulkEditField}
                    onChange={(e) => setBulkEditField(e.target.value as 'stock' | 'priceAdjustment')}
                    className="p-2 border rounded"
                >
                <option value="stock">재고 수량</option>
                <option value="priceAdjustment">추가 금액</option>
                </select>
                
                <input
                    type="number"
                    value={bulkEditValue}
                    onChange={(e) => setBulkEditValue(Number(e.target.value))}
                    className="p-2 border rounded w-24"
                />
                
                <button
                    onClick={applyBulkEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={selectedCombinations.length === 0}
                >
                적용 ({selectedCombinations.length}개)
                </button>
            </div>
            )}
        </>
    )
}

export default BulkEdit;
