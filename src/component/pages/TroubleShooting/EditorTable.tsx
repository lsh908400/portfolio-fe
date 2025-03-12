import React from 'react'
import CommonTable from '../../util/CommonTable';

interface EditorTableProps {
    tableInfo : any
}
const EditorTable : React.FC<EditorTableProps> = ({tableInfo}) => {

    // CheckHandler //
    const onCheckChange = (ids : (string | number)[]) => {
        console.log(ids)
    }

    // ClickHandler //
    const onClickHandler = (row : any) => {
        console.log(row)
    }

    const columns = [
        { id: 'id', header: 'No.', accessor: 'id', width: '10%' },
        { id: 'title', header: '제목', accessor: (row: any) => (
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
    <section className='h-full w-full !p-10'>
        <div className='text-[1.5em] flex items-center gap-2 !mb-24'>
            <i className={`${tableInfo.icon}`}></i>
            <p>{tableInfo.title}</p>
        </div>
        <CommonTable
            columns={columns}
            data={data}
            rowClickable={true}
            onRowClick={(row) => {onClickHandler(row)}}
            showCheckbox={true}
            onCheckChange={(ids) => {onCheckChange(ids)}}
        />
    </section>
    )
}

export default  EditorTable;