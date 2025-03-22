/**
 * 2025 03 22 - 이상훈
 * 1. useState - 현재 active된 버전 아코디언 / 필터 / 버전
 * 2. useQuery - 버전
 * 3. hadler - 버전 엑티브 / 필터적용 
 * 4. useEffect - 버전 초기상태 설정
 */

import React, { useEffect, useState } from 'react';
import { VersionChange, VersionData } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getVersions } from '../services/versionService';
import Loading from '../component/util/Loading';
import ErrorMessage from '../component/util/ErrorMessage';


const StatusBadge: React.FC<{ status: VersionData['status'] }> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
        case 'stable': return 'bg-green-100 text-green-800';
        case 'beta': return 'bg-blue-100 text-blue-800';
        case 'alpha': return 'bg-purple-100 text-purple-800';
        case 'rc': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
        }
};

    const getStatusText = () => {
        switch (status) {
        case 'stable': return '안정화 버전';
        case 'beta': return '베타';
        case 'alpha': return '알파';
        case 'rc': return 'RC';
        default: return status;
        }
};

    return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
        {getStatusText()}
    </span>
    );
};

const ChangeTypeIcon: React.FC<{ type: VersionChange['type'] }> = ({ type }) => {
    switch (type) {
        case 'feature':
        return <span className="text-blue-500" title="새 기능">✨</span>;
        case 'improvement':
        return <span className="text-green-500" title="개선사항">⚡</span>;
        case 'bugfix':
        return <span className="text-red-500" title="버그 수정">🐞</span>;
        case 'security':
        return <span className="text-orange-500" title="보안 업데이트">🔒</span>;
        default:
        return null;
    }
};

const Version: React.FC = () => {

    // 1. useState - 현재 active된 버전 아코디언 / 필터 / 버전
    const [activeVersion, setActiveVersion] = useState<string | null>();
    const [filter, setFilter] = useState<VersionChange['type'] | 'all'>('all');
    const [versions, setVersions] = useState<VersionData[]>();


    // 2. useQuery - 버전
    const {data: versionData, isLoading : isVersionLoading, isError : isVersionError, refetch : refetchVersion} = useQuery({
        queryKey : ['version'],
        queryFn : async () => {
            const response = await getVersions();
            return response.data;
        },
        enabled : true
    })


    // 3. hadler - 버전 엑티브 / 필터적용 
    const handleVersionClick = (version: string) => {
        setActiveVersion(version === activeVersion ? null : version);
    };

    const getFilteredChanges = (changes: VersionChange[]) => {
        if (filter === 'all') return changes;
        return changes.filter(change => change.type === filter);
    };


    // 4. useEffect - 버전 초기상태 설정
    useEffect(()=>{
        if(!isVersionError && !isVersionLoading && versionData)
        {
            setVersions(versionData);
            setActiveVersion(versionData[0]?.version)
        }
    },[versionData])

    return (
        <div className="px-4 py-8 max-h-full w-full overflow-y-auto overflow-x-hidden font-sans">
        <h1 className="text-3xl font-bold mb-8">버전 이력</h1>
        
        <div className="mb-6">
            <span className="mr-2 text-sm font-medium">필터:</span>
            <button 
            className={`mr-2 px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`} 
            onClick={() => setFilter('all')}
            >
            전체
            </button>
            <button 
            className={`mr-2 px-3 py-1 rounded-full text-sm ${filter === 'feature' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`} 
            onClick={() => setFilter('feature')}
            >
            ✨ 새 기능
            </button>
            <button 
            className={`mr-2 px-3 py-1 rounded-full text-sm ${filter === 'improvement' ? 'bg-green-500 text-white' : 'bg-green-100'}`}
            onClick={() => setFilter('improvement')}
            >
            ⚡ 개선사항
            </button>
            <button 
            className={`mr-2 px-3 py-1 rounded-full text-sm ${filter === 'bugfix' ? 'bg-red-500 text-white' : 'bg-red-100'}`}
            onClick={() => setFilter('bugfix')}
            >
            🐞 버그 수정
            </button>
            <button 
            className={`mr-2 px-3 py-1 rounded-full text-sm ${filter === 'security' ? 'bg-orange-500 text-white' : 'bg-orange-100'}`}
            onClick={() => setFilter('security')}
            >
            🔒 보안 업데이트
            </button>
        </div>
        
        <div className="space-y-6 overflow-auto">
        {isVersionLoading ? (<Loading />)
        : isVersionError ? (<ErrorMessage message='Version 로딩 에러' onRetry={refetchVersion}/>)
        : versions&&(versions?.length > 0 )? (
            versions?.map((version : any) => (
                <div 
                key={version.version} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                <div 
                    className="flex items-center justify-between px-6 py-4 bg-gray-50 cursor-pointer"
                    onClick={() => handleVersionClick(version.version)}
                >
                    <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold">{version.version}</h2>
                    <StatusBadge status={version.status} />
                    <span className="text-sm text-gray-500">{version.releaseDate}</span>
                    </div>
                    <div>
                    <svg 
                        className={`w-5 h-5 transition-transform ${activeVersion === version.version ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                    </div>
                </div>
                
                {activeVersion === version.version && (
                    <div className="px-6 py-4 ">
                    <p className="mb-4 text-gray-700">{version.summary}</p>
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">변경사항</h3>
                        <ul className="space-y-2">
                        {getFilteredChanges(version.changes).map((change) => (
                            <li key={change.id} className="flex items-start">
                            <div className="mr-2 mt-1">
                                <ChangeTypeIcon type={change.type} />
                            </div>
                            <div>
                                <p className="text-gray-800">{change.description}</p>
                                <div className="flex text-xs text-gray-500 mt-1">
                                {change.issueId && (
                                    <a href={`#${change.issueId}`} className="mr-3 hover:text-blue-500">
                                    이슈 {change.issueId}
                                    </a>
                                )}
                                {change.contributor && (
                                    <span>by {change.contributor}</span>
                                )}
                                </div>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    
                    
                    {version.knownIssues && version.knownIssues.length > 0 && (
                        <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">알려진 이슈</h3>
                        <ul className="list-disc list-inside text-gray-700 pl-2">
                            {version.knownIssues.map((issue : any, index : any) => (
                            <li key={index}>{issue}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                    </div>
                )}
                </div>
            ))
            ) : (
            <p>버전 정보가 없습니다.</p>
            )
            }
            </div>
        </div>
    );
};

export default Version;