import React, { ReactNode } from 'react';

// 각 필드의 설정을 위한 타입
interface FieldConfig {
    type: 'input' | 'select' | 'button' | 'textarea' | 'div' | 'range';
    id?: string;
    className?: string;
    label?: string;
    value?: any;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; 
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    children?: ReactNode;
    style?: React.CSSProperties;
    infoDivClassName? : string;
    [key: string]: any; // 추가 속성
    min?: number;
    max?: number;
    steps?: number; // 총 스텝 수
    blockWidth?: string;
    blockHeight?: string;
    filledSteps?: number; // 채워진 스텝 수
}

interface VariableInfoProps {
    id?: string;
    className?: string;
    title?: string;
    description?: string;
    fields: FieldConfig[];
    layout?: 'vertical' | 'horizontal' | 'grid';
    style?: React.CSSProperties;
    infoClassName?:string;
}

const VariableInfo: React.FC<VariableInfoProps> = ({
    id = 'variable_info',
    className = '',
    title,
    description,
    fields,
    layout = 'vertical',
    style,
}) => {
  // 레이아웃에 따른 클래스 이름 설정
  const layoutClassName = `variable-info-${layout}`;
  const containerClassName = `variable-info ${layoutClassName} ${className}`;

  // 각 필드 유형에 따른 렌더링 함수
  const renderField = (field: FieldConfig, index: number) => {
    const {
        type,
        id: fieldId,
        className: fieldClassName = '',
        label,
        value,
        placeholder,
        options,
        onChange,
        onClick,
        onKeyDown,
        children,
        style: fieldStyle,
        infoDivClassName,
        min ,
        max ,
        steps = 10,
        filledSteps = 0,
        blockWidth,
        blockHeight,
        ...rest
    } = field;

    // 필드 컨테이너
    const fieldContainer = (content: ReactNode) => (
      <div key={index} className={`variable-info-field ${fieldClassName}`}>
        {label && <label htmlFor={fieldId}>{label}</label>}
        {content}
        {type==='div' &&
            <div 
            onClick={(e) => onClick ? onClick(e) : undefined} 
            className={`${infoDivClassName}`}>{value}</div>
        }
      </div>
    );

    // 이벤트 핸들러 래퍼
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (onChange) 
        {
        onChange(e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if(onKeyDown)
        {
            onKeyDown(e);
        }
    }
    
    

    switch (type) {
        case 'range':
        return fieldContainer(
            <div className="range-container"
                onClick={(e) => onClick ? onClick(e) : undefined}
            >
            <div className="flex gap-1"
               onClick={(e) => onClick ? onClick(e) : undefined}
            >
                {Array.from({ length: steps }).map((_, i) => (
                <div
                    key={i}
                    style={{ width: blockWidth, height: blockHeight }}
                    className={`h-5 w-5 ${className} ${
                    i < filledSteps 
                        ? 'bg-gray-100' // 채워진 블록
                        : 'bg-gray-800' // 빈 블록
                    } border border-gray-400`}
                    
                />
                ))}
            </div>
            </div>
        );
        case 'input':
            return fieldContainer(
            <input
                id={fieldId}
                value={value}
                onChange={(e)=>handleChange(e)}
                onKeyDown={(e)=>handleKeyDown(e)}
                className='w-[80%] border-gray !border !px-1 rounded-sm'
                placeholder={placeholder}
                style={fieldStyle}
                {...rest}
            />
            );

        case 'select':
            return fieldContainer(
            <select
                id={fieldId}
                value={value}
                onChange={handleChange}
                style={fieldStyle}
                {...rest}
            >
                {options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            );

        case 'button':
            return fieldContainer(
            <button
                id={fieldId}
                onClick={(e) => onClick ? onClick(e) : undefined}
                style={fieldStyle}
                {...rest}
            >
                {children}
            </button>
            );

        case 'textarea':
            return fieldContainer(
            <textarea
                id={fieldId}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                style={fieldStyle}
                {...rest}
            />
            );

        case 'div':
        default:
            return fieldContainer(
            <div
                id={fieldId}
                style={fieldStyle}
                {...rest}
            >
                {children}
            </div>
            );
    }
  };

  return (
    <div id={id} className={containerClassName} style={style}>
      {title && <h3 className="variable-info-title">{title}</h3>}
      {description && <p className="variable-info-description">{description}</p>}
      <div className="variable-info-fields">
        {fields.map((field, index) => renderField(field, index))}
      </div>
    </div>
  );
};

export default VariableInfo;