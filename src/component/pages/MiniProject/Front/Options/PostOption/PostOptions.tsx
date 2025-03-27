import React, { useCallback } from 'react';
import { useOptionManagement } from '../../../../../../hooks/useOptionManagement';
import OptionFilter from './OptionFilter';
import ManageOptions from './ManageOptions';
import ManageGroups from './ManageGroups';
import BulkEdit from './BulkEdit';
import ProductInfo from './ProductInfo';

const BulkOptionManagement: React.FC = () => {
    const {
        // 상태
        optionGroups,
        filteredCombinations,
        bulkEditMode,
        bulkEditField,
        bulkEditValue,
        selectedCombinations,
        newOptionName,
        newOptionValues,
        showAddOptionForm,
        isTooManyResults,
        postFormData,
        
        // 상태 변경 함수
        setBulkEditMode,
        setBulkEditField,
        setBulkEditValue,
        setSelectedCombinations,
        setNewOptionName,
        setNewOptionValues,
        setShowAddOptionForm,
        setPostFormData,
        
        // 기능 함수
        addNewOptionGroup,
        regenerateCombinations,
        handleFilterChange,
        applyBulkEdit,
        handleCombinationChange
    } = useOptionManagement();

    const postProductHandler = useCallback(()=>{
        console.log(filteredCombinations)
        console.log(postFormData)
    },[postFormData,filteredCombinations])

    return (
    <div className="p-4 w-full max-w-6xl mx-auto">
        
        <h2 className="text-xl font-bold mb-4">상품 정보</h2>
        <ProductInfo 
            postFormData={postFormData}
            setPostFormData={setPostFormData}
        />
        <h2 className="text-xl font-bold mb-4">상품 옵션 일괄 관리</h2>
        <OptionFilter 
            optionGroups={optionGroups}
            handleFilterChange={handleFilterChange}
        />
        
        <div className="mb-6">
            <ManageOptions 
                showAddOptionForm={showAddOptionForm}
                setShowAddOptionForm={setShowAddOptionForm}
                newOptionName={newOptionName}
                setNewOptionName={setNewOptionName}
                newOptionValues={newOptionValues}
                setNewOptionValues={setNewOptionValues}
                addNewOptionGroup={addNewOptionGroup}
            />
            
            <ManageGroups 
                bulkEditMode={bulkEditMode}
                setBulkEditMode={setBulkEditMode}
                filteredCombinations={filteredCombinations}
                regenerateCombinations={regenerateCombinations}
                postProductHandler={postProductHandler}
            />
            
            <BulkEdit 
                applyBulkEdit={applyBulkEdit}
                bulkEditField={bulkEditField}
                bulkEditMode={bulkEditMode}
                bulkEditValue={bulkEditValue}
                selectedCombinations={selectedCombinations}
                setBulkEditField={setBulkEditField}
                setBulkEditValue={setBulkEditValue}
            />
        </div>
        
        {isTooManyResults && (
            <div className="p-3 mb-4 bg-yellow-100 border border-yellow-400 rounded-md text-yellow-700">
            조회 결과가 너무 많습니다. 필터를 더 적용하여 결과를 줄여주세요.
            </div>
        )}
        
        {/* 조합 테이블 */}
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100">
                {bulkEditMode && (
                    <th className="p-2 border text-center w-12">
                    <input
                        type="checkbox"
                        checked={selectedCombinations.length === filteredCombinations.length}
                        onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedCombinations(filteredCombinations.map(c => c.id));
                        } else {
                            setSelectedCombinations([]);
                        }
                        }}
                    />
                    </th>
                )}
                {optionGroups.map(group => (
                    <th key={group.id} className="p-2 border text-left">
                    {group.name}
                    </th>
                ))}
                <th className="p-2 border text-left">추가 금액</th>
                <th className="p-2 border text-left">재고</th>
                </tr>
            </thead>
            <tbody>
                {filteredCombinations.slice(0, 100).map((combo) => (
                <tr key={combo.id} className="border-b hover:bg-gray-50">
                    {bulkEditMode && (
                    <td className="p-2 border text-center">
                        <input
                        type="checkbox"
                        checked={selectedCombinations.includes(combo.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                            setSelectedCombinations(prev => [...prev, combo.id]);
                            } else {
                            setSelectedCombinations(prev => 
                                prev.filter(id => id !== combo.id)
                            );
                            }
                        }}
                        />
                    </td>
                    )}
                    {optionGroups.map(group => {
                    const option = combo.options.find(opt => opt.groupId === group.id);
                    return (
                        <td key={group.id} className="p-2 border">
                        {option?.valueName || '-'}
                        </td>
                    );
                    })}
                    <td className="p-2 border">
                    <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={combo.priceAdjustment}
                        onChange={(e) => handleCombinationChange(
                        combo.id, 
                        'priceAdjustment', 
                        Number(e.target.value)
                        )}
                    />
                    </td>
                    <td className="p-2 border">
                    <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={combo.stock}
                        onChange={(e) => handleCombinationChange(
                        combo.id, 
                        'stock', 
                        Number(e.target.value)
                        )}
                    />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            
            {filteredCombinations.length > 100 && (
            <div className="mt-3 text-center text-gray-500">
                전체 {filteredCombinations.length}개 중 100개만 표시됩니다. 필터를 적용하여 더 구체적인 결과를 확인하세요.
            </div>
            )}
        </div>
    </div>
    );
};

export default BulkOptionManagement;