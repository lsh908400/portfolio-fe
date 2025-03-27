import React from 'react'

interface ManageGroupsProps {
    filteredCombinations : any,
    regenerateCombinations : any,
    setBulkEditMode : any,
    bulkEditMode : any,
    postProductHandler : any,
}

const ManageGroups : React.FC<ManageGroupsProps> = ({filteredCombinations,regenerateCombinations,bulkEditMode,setBulkEditMode,postProductHandler}) => {
    return (
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">옵션 조합 목록 ({filteredCombinations.length}개)</h3>
            <div className="flex space-x-2">
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={postProductHandler}
                >
                    상품 등록
                </button>
                <button
                onClick={regenerateCombinations}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                조합 생성/재생성
                </button>
                <button
                onClick={() => setBulkEditMode(!bulkEditMode)}
                className={`px-4 py-2 rounded ${
                    bulkEditMode ? 'bg-gray-300' : 'bg-[#c9e140]'
                }`}
                >
                {bulkEditMode ? '일괄 편집 취소' : '일괄 편집'}
                </button>
            </div>
        </div>
    )
}

export default ManageGroups;
