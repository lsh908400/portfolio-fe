import React from 'react'

interface ManageOptionsProps {
    showAddOptionForm : any,
    setShowAddOptionForm : any,
    newOptionName : any,
    setNewOptionName : any,
    newOptionValues : any,
    setNewOptionValues : any,
    addNewOptionGroup : any,
}

const ManageOptions : React.FC<ManageOptionsProps> = ({showAddOptionForm,setShowAddOptionForm,newOptionName,setNewOptionName,newOptionValues,setNewOptionValues,addNewOptionGroup}) => {
    return (
        <>
        {!showAddOptionForm ? (
            <button
                onClick={() => setShowAddOptionForm(true)}
                className="px-4 py-2 bg-[#c9e140] rounded-md mb-4"
            >
                + 새 옵션 그룹 추가
            </button>
            ) : (
            <div className="p-4 border rounded-md mb-4 bg-gray-50">
                <h3 className="font-medium mb-3">새 옵션 그룹 추가</h3>
                <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">옵션 이름</label>
                    <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="예: 색상, 사이즈, 재질"
                    className="p-2 border rounded-md w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                    옵션 값 (쉼표로 구분)
                    </label>
                    <textarea
                    value={newOptionValues}
                    onChange={(e) => setNewOptionValues(e.target.value)}
                    placeholder="예: 빨강, 파랑, 초록"
                    className="p-2 border rounded-md w-full h-20"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                    onClick={addNewOptionGroup}
                    className="px-4 py-2 bg-[#c9e140] rounded-md"
                    >
                    추가
                    </button>
                    <button
                    onClick={() => {
                        setShowAddOptionForm(false);
                        setNewOptionName('');
                        setNewOptionValues('');
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    >
                    취소
                    </button>
                </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ManageOptions;
