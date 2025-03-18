/**
 * 2025 03 17 - 이상훈
 * 0. 기본 설정 - 호출 / 언어팩 / 날짜 포매터 / 폼데이터 리셋 / 에디터모드 / 코드복사 / 모든태그
 * 1. useState - 스니펫 , 필터 , 활성상태 , 수정상태 , 검색어 , 태그 , 등록 , 태그 
 * 2. useQuery - 스니펫 불러오기 (페이징처리)
 * 3. mutation - 스니펫 등록 / 수정 / 삭제
 * 4. trigger mutation - 등록 , 수정 / 삭제
 * 5. handler - 태그 추가 / 삭제 / 인풋수정
 * 6. useEffect - 로드된 데이터 저장 / 뒤로가기 언마운트시 쿼리 초기화
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Snippet } from '../../../../types';
import { deleteSnippet, getSnippets, postSnippet, putSnippet } from '../../../../services/snippetService';
import { SnipetResponse } from '../../../../types/serach';
import Loading from '../../../util/Loading';
import ErrorMessage from '../../../util/ErrorMessage';



const CodeSnippet: React.FC = () => {

    // 0. 기본 설정 - 호출 / 언어팩 / 날짜 포매터 / 폼데이터 리셋 / 에디터모드 / 코드복사 / 모든태그
    const queryClient = useQueryClient();
    const languages = [
        'javascript', 'typescript', 'python', 'java', 'csharp', 'php', 
        'go', 'rust', 'ruby', 'html', 'css', 'sql', 'bash', 'json', 'xml'
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            code: '',
            language: 'javascript',
            desc: '',
            tags: []
        });
        setTagInput('');
        setIsEditing(false);
        setActiveSnippet(null);
    };

    const handleEditSnippet = (snippet: Snippet) => {
        setActiveSnippet(snippet);
        setFormData({
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            desc: snippet.desc,
            tags: [...snippet.tags]
        });
        setIsEditing(true);
    };

    const handleCopyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code)
        .then(() => {
            alert('코드가 클립보드에 복사되었습니다.');
        })
        .catch(err => {
            console.error('클립보드 복사 실패:', err);
        });
    };

    const getAllTags = () => {
        const allTags = snippets.flatMap(snippet => snippet.tags);
        return [...new Set(allTags)].sort(); // 중복 제거 및 정렬
    };


    // 1. useState - 스니펫 , 필터 , 활성상태 , 수정상태 , 검색어 , 태그 , 등록 , 태그 
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [formData, setFormData] = useState<Omit<Snippet, 'id' | 'createdAt'>>({
        title: '',
        code: '',
        language: 'javascript',
        desc: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState<string>('');


    // 2. useQuery - 스니펫 불러오기 (페이징처리)
    const {
        data,
        isLoading, 
        isError,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery<SnipetResponse, Error>({
        queryKey: ['snippets', searchTerm, selectedTag],
        queryFn: async ({ pageParam }) => {
            return await getSnippets({
                cursor: pageParam as string | null,
                limit: 5,
                searchTerm: searchTerm,
                tags: selectedTag
            });
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: true
    });


    // 3. mutation - 스니펫 등록 / 수정 / 삭제
    const postMutation = useMutation({
        mutationFn: (formData: Omit<Snippet, 'id' | 'createdAt'>) => postSnippet(formData),
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
        },
        onError: (error: any) => {
            console.error('스니펫 추가 중 에러 발생:', error);
            alert('스니펫 추가에 실패했습니다.');
        }
    })

    const putMutation = useMutation({
        mutationFn: (formData: Snippet) => putSnippet(formData),
        onSuccess: async (response) => {
            alert(response.message);
        },
        onError: (error: any) => {
            console.error('스니펫 수정 중 에러 발생: ',error);
            alert('스니펫 수정에 실패했습니다.')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSnippet(id),
        onSuccess: async (response) => {
            alert(response.message);
        },
        onError: (err:any) => {
            console.error('스니펫 삭제 중 에러 발생: ',err)
            alert('스니펫 삭제에 실패했습니다.')
        }
    })

    // 4. trigger mutation - 등록 , 수정 / 삭제
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing && activeSnippet) {
            const updatedSnippets : Snippet[] = snippets.map(snippet => 
                snippet.id === activeSnippet.id 
                ? { ...activeSnippet, ...formData, createdAt: activeSnippet.createdAt } 
                : snippet
            );
            putMutation.mutate(updatedSnippets[0],{
                onSuccess: () => {
                    setSnippets(updatedSnippets)
                    resetForm();
                }
            });
        } else {
            postMutation.mutate(formData,{
                onSuccess : () =>{
                    resetForm();
                }
            })
        
        }
    };

    const handleDeleteSnippet = (id: string) => {
        if (!window.confirm('정말 이 스니펫을 삭제하시겠습니까?')) return;
        deleteMutation.mutate(id, {
            onSuccess : () => {
                setSnippets(prev => prev.filter(snippet => snippet.id !== id));
                if (activeSnippet?.id !== id) return;
                setActiveSnippet(null);
            }
        })
    };


    // 5. handler - 태그 추가 / 삭제 / 인풋수정
    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, tagInput.trim()]
        }));
        setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    
    // 6. useEffect - 로드된 데이터 저장 / 뒤로가기 언마운트시 쿼리 초기화
    useEffect(() => {
        if (!data) return;
        const allSnippets = data.pages.flatMap(page => page.data);
        setSnippets(allSnippets);
    }, [data,searchTerm,selectedTag]);

    useEffect(()=>{
        return () => {
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
        }
    },[])

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold text-center mb-8">코드 스니펫 관리자</h1>
        
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow">
                    <div className="mb-4">
                        <input
                        type="text"
                        placeholder="스니펫 검색..."
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        >
                        <option value="">모든 태그</option>
                        {getAllTags().map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                        </select>
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-4"
                        onClick={() => {
                            resetForm();
                            setIsEditing(false);
                        }}
                    >
                        + 새 스니펫 추가
                    </button>
                
                    <div className="space-y-2 mt-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {isLoading ? (
                        <Loading />
                        ) : isError ? (
                        <ErrorMessage message='오류가 발생했습니다.' variant='inline' onRetry={refetch}/>
                        ) : (
                        <>
                            {snippets.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">
                                {searchTerm || selectedTag
                                ? '검색 결과가 없습니다.'
                                : '스니펫이 없습니다. 새 스니펫을 추가해보세요!'
                                }
                            </p>
                            ) : (
                            // 페이지의 모든 데이터를 펼쳐서 맵핑
                            snippets.map(snippet => (
                                <div
                                key={snippet.id}
                                className={`p-3 rounded cursor-pointer transition ${
                                    activeSnippet?.id === snippet.id
                                    ? 'bg-blue-100 border-l-4 border-blue-500'
                                    : 'bg-white hover:bg-gray-100 border'
                                }`}
                                onClick={() => setActiveSnippet(snippet)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-800">{snippet.title}</h3>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                        {snippet.language}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {snippet.desc || '설명 없음'}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {snippet.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                                            onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedTag(tag);
                                            }}
                                        >
                                            {tag}
                                        </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        {formatDate(snippet.createdAt)}
                                    </div>
                                </div>
                                ))
                            )}
                            {hasNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                className="w-full py-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
                            >
                                More
                            </button>
                            )}
                        </>
                        )}
                    </div>
                </div>
                
                {/* 오른쪽 메인 영역 - 스니펫 상세보기/편집 */}
                <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow">
                {isEditing || (!activeSnippet) ? (
                    // 스니펫 추가/편집 폼
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? '스니펫 편집' : '새 스니펫 추가'}
                    </h2>
                    
                    <div>
                        <label className="block mb-1 font-medium">제목</label>
                        <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="스니펫 제목"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium">설명</label>
                        <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="스니펫에 대한 설명"
                        rows={2}
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium">언어</label>
                        <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium">코드</label>
                        <textarea
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="여기에 코드를 입력하세요..."
                        rows={10}
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium">태그</label>
                        <div className="flex">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="태그 추가 (Enter 키 또는 추가 버튼)"
                            onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                            }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
                        >
                            추가
                        </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                            <span
                            key={tag}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center text-sm"
                            >
                            {tag}
                            <button
                                type="button"
                                className="ml-1 text-blue-500 hover:text-blue-700"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                &times;
                            </button>
                            </span>
                        ))}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                        {isEditing ? '저장' : '추가'}
                        </button>
                        <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                        >
                        취소
                        </button>
                    </div>
                    </form>
                ) : activeSnippet ? (
                    // 스니펫 상세 보기
                    <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{activeSnippet.title}</h2>
                        <div className="space-x-2">
                        <button
                            onClick={() => handleEditSnippet(activeSnippet)}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
                        >
                            편집
                        </button>
                        <button
                            onClick={() => handleCopyToClipboard(activeSnippet.code)}
                            className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 text-sm"
                        >
                            복사
                        </button>
                        <button
                            onClick={() => handleDeleteSnippet(activeSnippet.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                        >
                            삭제
                        </button>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <p className="text-gray-600">
                        {activeSnippet.desc || '설명 없음'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">언어:</span>
                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {activeSnippet.language}
                        </span>
                    </div>
                    
                    <div className="mb-4">
                        <SyntaxHighlighter 
                        language={activeSnippet.language} 
                        style={vscDarkPlus}
                        className="rounded"
                        customStyle={{ padding: '1rem' }}
                        showLineNumbers={true}
                        >
                        {activeSnippet.code}
                        </SyntaxHighlighter>
                    </div>
                    
                    {activeSnippet.tags.length > 0 && (
                        <div className="mb-4">
                        <span className="font-medium">태그:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {activeSnippet.tags.map(tag => (
                            <span
                                key={tag}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                        생성일: {formatDate(activeSnippet.createdAt)}
                    </div>
                    </div>
                ) : (
                    // 아무 스니펫도 선택되지 않은 경우
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>왼쪽 목록에서 스니펫을 선택하거나 새 스니펫을 추가하세요.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default CodeSnippet;