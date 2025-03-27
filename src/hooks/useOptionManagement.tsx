// useOptionManagement.ts
import { useState, useMemo } from 'react';

// 타입 정의
export interface OptionValue {
    id: string;
    value: string;
}

export interface OptionGroup {
    id: string;
    name: string;
    values: OptionValue[];
}

export interface OptionCombination {
    id: string;
    options: {
        groupId: string;
        valueId: string;
        valueName: string;
    }[];
    stock: number;
    priceAdjustment: number;
}

export interface PostFormData {
    name : string;
    description : string;
    base_price : number;
}

export interface OptionManagementHook {
  // 상태
    optionGroups: OptionGroup[];
    combinations: OptionCombination[];
    filteredCombinations: OptionCombination[];
    filters: Record<string, string[]>;
    bulkEditMode: boolean;
    bulkEditField: 'stock' | 'priceAdjustment';
    bulkEditValue: number;
    selectedCombinations: string[];
    newOptionName: string;
    newOptionValues: string;
    showAddOptionForm: boolean;
    isTooManyResults: boolean;
    postFormData : PostFormData;
    
    // 액션
    setOptionGroups: React.Dispatch<React.SetStateAction<OptionGroup[]>>;
    setCombinations: React.Dispatch<React.SetStateAction<OptionCombination[]>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    setBulkEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setBulkEditField: React.Dispatch<React.SetStateAction<'stock' | 'priceAdjustment'>>;
    setBulkEditValue: React.Dispatch<React.SetStateAction<number>>;
    setSelectedCombinations: React.Dispatch<React.SetStateAction<string[]>>;
    setNewOptionName: React.Dispatch<React.SetStateAction<string>>;
    setNewOptionValues: React.Dispatch<React.SetStateAction<string>>;
    setShowAddOptionForm: React.Dispatch<React.SetStateAction<boolean>>;
    setPostFormData : React.Dispatch<React.SetStateAction<PostFormData>>;
    
    // 함수
    generateCombinations: () => OptionCombination[];
    addNewOptionGroup: () => void;
    regenerateCombinations: () => void;
    handleFilterChange: (groupId: string, valueId: string, checked: boolean) => void;
    applyBulkEdit: () => void;
    handleCombinationChange: (id: string, field: 'stock' | 'priceAdjustment', value: number) => void;
}

export const useOptionManagement = (initialOptionGroups: OptionGroup[] = []): OptionManagementHook => {
    // 옵션 그룹 상태
    const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(initialOptionGroups);
    
    // 새 옵션 그룹 추가를 위한 상태
    const [newOptionName, setNewOptionName] = useState<string>('');
    const [newOptionValues, setNewOptionValues] = useState<string>('');
    const [showAddOptionForm, setShowAddOptionForm] = useState<boolean>(false);
    const [postFormData, setPostFormData] = useState<PostFormData>({
        name : '',
        description : '',
        base_price : 0
    });

    // 모든 조합 생성 함수
    const generateCombinations = (): OptionCombination[] => {
        if (optionGroups.length === 0) return [];
        
        // 첫 번째 옵션 그룹으로 시작
        let combinations: OptionCombination[] = optionGroups[0].values.map((value, index) => ({
        id: `combo-${index}`,
        options: [{
            groupId: optionGroups[0].id,
            valueId: value.id,
            valueName: value.value
        }],
        stock: 0,
        priceAdjustment: 0
        }));
        
        // 나머지 옵션 추가
        for (let i = 1; i < optionGroups.length; i++) {
        const newCombinations: OptionCombination[] = [];
        
        combinations.forEach(combo => {
            optionGroups[i].values.forEach(value => {
            newCombinations.push({
                id: `${combo.id}-${value.id}`,
                options: [
                ...combo.options,
                {
                    groupId: optionGroups[i].id,
                    valueId: value.id,
                    valueName: value.value
                }
                ],
                stock: combo.stock,
                priceAdjustment: combo.priceAdjustment
            });
            });
        });
        
        combinations = newCombinations;
        }
        
        return combinations;
    };
    
    const [combinations, setCombinations] = useState<OptionCombination[]>(() => generateCombinations());
    
    // 새 옵션 그룹 추가
    const addNewOptionGroup = () => {
        if (!newOptionName.trim()) {
        alert('옵션 이름을 입력해주세요.');
        return;
        }
        
        if (!newOptionValues.trim()) {
        alert('옵션 값을 입력해주세요.');
        return;
        }
        
        // 쉼표로 구분된 옵션 값을 배열로 변환
        const valueArray = newOptionValues.split(',').map(v => v.trim()).filter(v => v);
        
        if (valueArray.length === 0) {
        alert('최소 하나 이상의 옵션 값이 필요합니다.');
        return;
        }
        
        // 새 옵션 그룹 생성
        const newGroup: OptionGroup = {
        id: `g${Date.now()}`,
        name: newOptionName,
        values: valueArray.map((value, index) => ({
            id: `v${Date.now()}-${index}`,
            value
        }))
        };
        
        // 옵션 그룹 추가
        setOptionGroups(prev => [...prev, newGroup]);
        
        // 폼 초기화
        setNewOptionName('');
        setNewOptionValues('');
        setShowAddOptionForm(false);
    };
    
    // 조합 재생성 함수
    const regenerateCombinations = () => {
        setCombinations(generateCombinations());
    };
    
    // 필터 상태
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    
    // 일괄 편집 상태
    const [bulkEditMode, setBulkEditMode] = useState<boolean>(false);
    const [bulkEditField, setBulkEditField] = useState<'stock' | 'priceAdjustment'>('stock');
    const [bulkEditValue, setBulkEditValue] = useState<number>(0);
    const [selectedCombinations, setSelectedCombinations] = useState<string[]>([]);
    
    // 필터 적용된 조합
    const filteredCombinations = useMemo(() => {
        return combinations.filter(combo => {
        for (const groupId in filters) {
            if (filters[groupId].length > 0) {
            const option = combo.options.find(opt => opt.groupId === groupId);
            if (!option || !filters[groupId].includes(option.valueId)) {
                return false;
            }
            }
        }
        return true;
        });
    }, [combinations, filters]);
    
    // 필터 변경 핸들러
    const handleFilterChange = (groupId: string, valueId: string, checked: boolean) => {
        setFilters(prev => {
        const newFilters = { ...prev };
        
        if (!newFilters[groupId]) {
            newFilters[groupId] = [];
        }
        
        if (checked) {
            newFilters[groupId] = [...newFilters[groupId], valueId];
        } else {
            newFilters[groupId] = newFilters[groupId].filter(id => id !== valueId);
        }
        
        return newFilters;
        });
    };
    
    // 일괄 편집 적용
    const applyBulkEdit = () => {
        setCombinations(prev => 
        prev.map(combo => {
            if (selectedCombinations.includes(combo.id)) {
            return {
                ...combo,
                [bulkEditField]: bulkEditValue
            };
            }
            return combo;
        })
        );
        setSelectedCombinations([]);
        setBulkEditMode(false);
    };
    
    // 개별 데이터 변경
    const handleCombinationChange = (id: string, field: 'stock' | 'priceAdjustment', value: number) => {
        setCombinations(prev => 
        prev.map(combo => 
            combo.id === id 
            ? { ...combo, [field]: value } 
            : combo
        )
        );
    };
    
    // 현재 표시되는 데이터가 너무 많은지 확인
    const isTooManyResults = filteredCombinations.length > 30;

    return {
        // 상태
        optionGroups,
        combinations,
        filteredCombinations,
        filters,
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
        setOptionGroups,
        setCombinations,
        setFilters,
        setBulkEditMode,
        setBulkEditField,
        setBulkEditValue,
        setSelectedCombinations,
        setNewOptionName,
        setNewOptionValues,
        setShowAddOptionForm,
        setPostFormData,
        
        // 기능 함수
        generateCombinations,
        addNewOptionGroup,
        regenerateCombinations,
        handleFilterChange,
        applyBulkEdit,
        handleCombinationChange
    };
};