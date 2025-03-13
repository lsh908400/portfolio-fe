import React, { useEffect } from 'react';
import CommonBtn from './CommonBtn';

// 검색 옵션 타입
interface SearchOption {
  value: string;
  label: string;
}

// 버튼 인터페이스
interface ButtonProps {
  show: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
}

// 컬럼 정의 인터페이스
interface TableColumn {
  id: string;
  header: string | React.ReactNode;
  accessor: string | ((row: any) => React.ReactNode);
  width: string; // 퍼센트 값 (예: "10%")
  onClick?: (row: any) => void; // 셀 클릭 이벤트 핸들러
  clickable?: boolean; // 셀이 클릭 가능한지 여부
}

// 테이블 컴포넌트의 Props 인터페이스
interface CommonTableProps {
  // 검색 관련 props
  showSearch?: boolean;
  searchOptions?: SearchOption[];
  defaultSearchOption?: string;
  onSearch?: (option: string, keyword: string) => void;
  searchPlaceholder?: string;
  
  // 버튼 관련 props
  registerButton?: ButtonProps;
  editButton?: ButtonProps;
  deleteButton?: ButtonProps;
  
  // 테이블 관련 props
  columns: TableColumn[];
  data: any[];
  showCheckbox?: boolean;
  checkedItems?: (string| number)[];
  onCheckChange?: (ids: (string | number)[]) => void;
  
  // 행 클릭 관련 props
  onRowClick?: (row: any) => void;
  rowClickable?: boolean;
  
  // 스타일 관련 props
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  
}


const CommonTable: React.FC<CommonTableProps> = ({
  // 검색 관련 기본값 설정
  showSearch = true,
  searchOptions = [{ value: 'title', label: '제목' }, { value: 'date', label: '작성일' }],
  defaultSearchOption = 'title',
  onSearch = () => {},
  searchPlaceholder = 'Search',
  
  // 버튼 관련 기본값 설정
  registerButton = { show: true, label: '등록' },
  editButton = { show: true, label: '수정' },
  deleteButton = { show: true, label: '삭제' },
  
  // 테이블 관련 기본값 설정
  columns = [],
  data = [],
  showCheckbox = true,
  checkedItems = [],
  onCheckChange = () => {},
  
  // 행 클릭 관련 기본값 설정
  onRowClick,
  rowClickable = false,
  
  // 스타일 관련 기본값 설정
  tableClassName = 'w-full border-collapse border-spacing-1',
  headerClassName = 'border-b-2 h-10 text-gray-400 font-normal text-[0.8em]',
  rowClassName = 'border-b h-10 text-gray-400 font-normal text-[0.8em]',
  cellClassName = 'text-start px-4'
}) => {

  
  // 검색 상태 관리
  const [searchOption, setSearchOption] = React.useState(defaultSearchOption);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  
  // 체크박스 상태 관리
  const [selectedItems, setSelectedItems] = React.useState<(string | number)[]>(checkedItems);
  
  // 체크박스 전체 선택 처리
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data.length > 0) {
      // ID로 가정, 필요에 따라 조정
      const allIds = data.map((item) => item.id || item._id);
      setSelectedItems(allIds);
      onCheckChange(allIds);
    } else {
      setSelectedItems([]);
      onCheckChange([]);
    }
  };

  useEffect(() => {
    // checkedItems가 변경될 때 selectedItems 상태 업데이트
    setSelectedItems(checkedItems);
  }, [checkedItems]);
  
  // 개별 체크박스 처리
  const handleSelectItem = (e: React.ChangeEvent<HTMLInputElement>, id: string | number) => {
    let newSelectedItems;
    if (e.target.checked) {
      newSelectedItems = [...selectedItems, id];
    } else {
      newSelectedItems = selectedItems.filter(item => item !== id);
    }
    setSelectedItems(newSelectedItems);
    onCheckChange(newSelectedItems);
  };
  
  // 검색 처리
  const handleSearch = () => {
    onSearch(searchOption, searchKeyword);
  };
  
  return (
    <div className="common-table-container">
      {/* 상단 검색 및 버튼 영역 */}
      <article className='w-full bg-table-additional-box rounded-t-md h-[3em] flex justify-between items-center p-4'>
        {/* 검색 영역 */}
        {showSearch && (
          <article className='left_search_box flex gap-2'>
            <select 
              className='w-20 h-8 bg-white text-center border-gray rounded-md'
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            >
              {searchOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className='w-52 h-8 flex items-center bg-white border-gray gap-1 px-2 rounded-md'>
              <i className="fa-solid fa-magnifying-glass opacity-20"></i>
              <input 
                placeholder={searchPlaceholder}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <CommonBtn
              buttonName='검색'
              className='bg-button-primary rounded-md w-12 h-8 text-white box-shadow-none'
              onClick={handleSearch}
            />
          </article>
        )}
        
        {/* 버튼 영역 */}
        <article className='right_btn_box flex gap-2'>
          {registerButton.show && (
            <CommonBtn
              buttonName={registerButton.label || '등록'}
              className={registerButton.className || 'bg-button-primary rounded-md w-12 h-8 text-white box-shadow-none font-bold'}
              onClick={registerButton.onClick}
            />
          )}
          {editButton.show && (
            <CommonBtn
              buttonName={editButton.label || '수정'}
              className={editButton.className || 'bg-button-sub rounded-md w-12 h-8 text-button-sub box-shadow-none border-button-sub font-bold'}
              onClick={editButton.onClick}
            />
          )}
          {deleteButton.show && (
            <CommonBtn
              buttonName={deleteButton.label || '삭제'}
              className={deleteButton.className || 'bg-button-sub rounded-md w-12 h-8 text-button-sub box-shadow-none border-button-sub font-bold'}
              onClick={deleteButton.onClick}
            />
          )}
        </article>
      </article>
      
      {/* 테이블 영역 */}
      <table className={tableClassName}>
        <colgroup>
          {showCheckbox && <col width="10%" />}
          {columns.map((column, index) => (
            <col key={index} width={column.width} />
          ))}
        </colgroup>
        <thead>
          <tr className={headerClassName}>
            {showCheckbox && (
              <th className={cellClassName}>
                <input 
                  type='checkbox' 
                  onChange={handleSelectAll}
                  checked={selectedItems.length > 0 && selectedItems.length === data.length}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th key={index} className={cellClassName}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${rowClassName} ${rowClickable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={rowClickable && onRowClick ? (e) => {
                // 체크박스 클릭 시 행 클릭 이벤트가 발생하지 않도록 처리
                if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
                  return;
                }
                onRowClick(row);
              } : undefined}
            >
              {showCheckbox && (
                <td className={`${cellClassName} ${(row.ccategoryId === '0' || row.categoryId === 0) ? 'bg-blue-100' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <input 
                    type='checkbox'
                    checked={selectedItems.includes(row.id || row._id)}
                    onChange={(e) => handleSelectItem(e, row.id || row._id)}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`${cellClassName} ${column.clickable && !rowClickable ? 'cursor-pointer hover:bg-gray-100' : ''} ${(row.ccategoryId === '0' || row.categoryId === 0) ? 'bg-blue-100' : ''}`}
                  onClick={(e) => {
                    // 행 클릭이 활성화되어 있지 않고, 특정 컬럼만 클릭 가능한 경우
                    if (!rowClickable && column.clickable && column.onClick) {
                      e.stopPropagation();
                      column.onClick(row);
                    }
                  }}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : column.accessor === 'id'
                      ? rowIndex + 1 
                      : row[column.accessor] 
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;

// 사용 예시:
/*
const App = () => {
  const columns = [
    { id: 'id', header: 'No.', accessor: 'id', width: '10%' },
    { id: 'title', header: '제목', accessor: row => (
      <><i className="fa-solid fa-bullhorn mr-1"></i>{row.title}</>
    ), width: '40%' },
    { id: 'createdAt', header: '작성일', accessor: 'createdAt', width: '20%' },
    { id: 'updatedAt', header: '최종수정일', accessor: 'updatedAt', width: '20%' },
  ];

  const data = [
    { 
      id: 1, 
      title: 'Trouble Shooting 작성양식', 
      createdAt: '2024. 08. 03', 
      updatedAt: '2025. 03. 12'
    },
    // 더 많은 데이터...
  ];

  return (
    <CommonTable
      columns={columns}
      data={data}
      onSearch={(option, keyword) => console.log(`검색: ${option} - ${keyword}`)}
      registerButton={{
        show: true,
        onClick: () => console.log('등록 버튼 클릭')
      }}
    />
  );
};
*/