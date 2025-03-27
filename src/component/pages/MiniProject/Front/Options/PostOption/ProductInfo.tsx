import React from 'react'
import { PostFormData } from '../../../../../../hooks/useOptionManagement';

interface ProductInfoProps {
    postFormData : PostFormData;
    setPostFormData : React.Dispatch<React.SetStateAction<PostFormData>>;
}

const ProductInfo : React.FC<ProductInfoProps> = ({
    postFormData,
    setPostFormData
}) => {
    return (
        <section className='mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className="space-y-4">
                <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        상품명 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={postFormData.name}
                        onChange={(e)=>setPostFormData({...postFormData,name : e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9e140] focus:border-transparent"
                        placeholder="상품명을 입력하세요"
                    />
                </div>
                
                <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        상품 설명
                    </label>
                    <textarea
                        id="productDescription"
                        name="productDescription"
                        value={postFormData.description}
                        onChange={(e)=>setPostFormData({...postFormData,description : e.target.value})}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9e140] focus:border-transparent"
                        placeholder="상품에 대한 상세 설명을 입력하세요"
                    />
                </div>
                
                <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        기본 가격 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">₩</span>
                        </div>
                        <input
                            value={postFormData.base_price}
                            onChange={(e)=>setPostFormData({...postFormData, base_price : Number(e.target.value)})}
                            type="number"
                            id="basePrice"
                            name="basePrice"
                            min="0"
                            step="100"
                            className="w-full pl-7 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9e140] focus:border-transparent"
                            placeholder="0"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">상품의 기본 가격을 입력하세요. 옵션별 추가 금액은 옵션 설정에서 지정할 수 있습니다.</p>
                </div>
            </div>
        </section>
    )
}

export default ProductInfo;
