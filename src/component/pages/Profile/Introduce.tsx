/**
 * 2025 03 05 - 이상훈
 * React Query로 리팩토링
 * 1. React Query Hooks - 유저 데이터 / 소개글 데이터 / 소개글 업데이트 뮤테이션
 * 2. useState - 수정중 상태관리
 * 3. ClickHandler - 소개글 변경 / 기술 정보 / 이메일 저장
 * 4. ChangeHandler - 소개글 변경
 */

import React, { useState } from 'react'
import VariableInfo from '../../util/VariableInfo'
import useClickHandler from '../../../hooks/useClickHandler';
import { getIntroduction, getUser, putAdventage, putGoals, putGrowth, putMotivation } from '../../../services/profileService';
import { introduction } from '../../../types';
import CommonBtn from '../../util/CommonBtn';
import useChangeHandler from '../../../hooks/useChangeHandler';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../util/Loading';

const Introduce: React.FC = () => {
    const queryClient = useQueryClient();

    // 1. React Query Hooks - 유저 데이터 / 소개글 데이터 / 소개글 업데이트 뮤테이션
    const { 
        data: user, 
        isLoading: isUserLoading, 
        isError: isUserError,
        error: userError 
    } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await getUser();
            return response.data;
        }
    });

    const { 
        data: introductionData, 
        isLoading: isIntroductionLoading, 
        isError: isIntroductionError,
        error: introductionError
    } = useQuery({
        queryKey: ['introduction'],
        queryFn: async () => {
            const response = await getIntroduction();
            return response.data;
        }
    });

    // 소개글 업데이트 뮤테이션
    const motivationMutation = useMutation({
        mutationFn: (text: string) => putMotivation(text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['introduction'] });
        }
    });

    const growthMutation = useMutation({
        mutationFn: (text: string) => putGrowth(text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['introduction'] });
        }
    });

    const adventageMutation = useMutation({
        mutationFn: (text: string) => putAdventage(text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['introduction'] });
        }
    });

    const goalsMutation = useMutation({
        mutationFn: (text: string) => putGoals(text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['introduction'] });
        }
    });

    // 2. useState - 수정중 상태관리
    const [isEditing, setIsEditing] = useState([
        { id: "motivation", isEditing: false },
        { id: "growth", isEditing: false },
        { id: "adventage", isEditing: false },
        { id: "goals", isEditing: false }
    ]);

    // 로컬 상태로 소개글 데이터 관리
    const [localIntroduction, setLocalIntroduction] = useState<introduction | undefined>(introductionData);

    // 데이터가 로드되면 로컬 상태 업데이트
    React.useEffect(() => {
        if (introductionData) {
            setLocalIntroduction(introductionData);
        }
    }, [introductionData]);

    // 3. ClickHandler - 소개글 변경 / 기술 정보 / 이메일 저장
    const handleClick = useClickHandler((e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        const bIsClickedPutMoti = target.classList.contains('put_moti')
        const bIsCLickedPutGrowth = target.classList.contains('put_growth')
        const bIsCLickedPutAdv = target.classList.contains('put_adv')
        const bIsCLickedPutGoals = target.classList.contains('put_goals')
        
        switch (true) {
            case bIsClickedPutMoti: {
                if (isEditing[0].isEditing) {
                    setIsEditing(isEditing.map(item =>
                        item.id === 'motivation' ? { ...item, isEditing: false } : item
                    ));
                    target.textContent = '수정';
                    
                    if (localIntroduction?.motivation) {
                        motivationMutation.mutate(localIntroduction.motivation, {
                            onSuccess: (response) => {
                                alert(response.data);
                            },
                            onError: (error: any) => {
                                console.error('동기 업데이트 중 오류:', error);
                                alert('동기 업데이트에 실패했습니다.');
                            }
                        });
                    }
                    return;
                }
                setIsEditing(isEditing.map(item =>
                    item.id === 'motivation' ? { ...item, isEditing: true } : item
                ));
                target.textContent = '수정완료';
                break;
            }
            case bIsCLickedPutGrowth: {
                if (isEditing[1].isEditing) {
                    setIsEditing(isEditing.map(item =>
                        item.id === 'growth' ? { ...item, isEditing: false } : item
                    ));
                    target.textContent = '수정';
                    
                    if (localIntroduction?.growth) {
                        growthMutation.mutate(localIntroduction.growth, {
                            onSuccess: (response) => {
                                alert(response.data);
                            },
                            onError: (error: any) => {
                                console.error('성장과정 업데이트 중 오류:', error);
                                alert('성장과정 업데이트에 실패했습니다.');
                            }
                        });
                    }
                    return;
                }
                setIsEditing(isEditing.map(item =>
                    item.id === 'growth' ? { ...item, isEditing: true } : item
                ));
                target.textContent = '수정완료';
                break;
            }
            case bIsCLickedPutAdv: {
                if (isEditing[2].isEditing) {
                    setIsEditing(isEditing.map(item =>
                        item.id === 'adventage' ? { ...item, isEditing: false } : item
                    ));
                    target.textContent = '수정';
                    
                    if (localIntroduction?.adventage) {
                        adventageMutation.mutate(localIntroduction.adventage, {
                            onSuccess: (response) => {
                                alert(response.data);
                            },
                            onError: (error: any) => {
                                console.error('장단점 업데이트 중 오류:', error);
                                alert('장단점 업데이트에 실패했습니다.');
                            }
                        });
                    }
                    return;
                }
                setIsEditing(isEditing.map(item =>
                    item.id === 'adventage' ? { ...item, isEditing: true } : item
                ));
                target.textContent = '수정완료';
                break;
            }
            case bIsCLickedPutGoals: {
                if (isEditing[3].isEditing) {
                    setIsEditing(isEditing.map(item =>
                        item.id === 'goals' ? { ...item, isEditing: false } : item
                    ));
                    target.textContent = '수정';
                    
                    if (localIntroduction?.goals) {
                        goalsMutation.mutate(localIntroduction.goals, {
                            onSuccess: (response) => {
                                alert(response.data);
                            },
                            onError: (error: any) => {
                                console.error('포부 업데이트 중 오류:', error);
                                alert('포부 업데이트에 실패했습니다.');
                            }
                        });
                    }
                    return;
                }
                setIsEditing(isEditing.map(item =>
                    item.id === 'goals' ? { ...item, isEditing: true } : item
                ));
                target.textContent = '수정완료';
                break;
            }
            default: {
                const bIsClickedFront = target.closest('.front_end');
                const bIsClickedBack = target.closest('.back_end');
                const bIsClickedDesign = target.closest('.design');
                const bIsClickedEmail = target.closest('.user_email');
                const bIsClickedDatabase = target.closest('.db');
                
                if (bIsClickedFront) {
                    console.log(bIsClickedFront);
                }
                else if (bIsClickedBack) {
                    console.log(bIsClickedBack);
                }
                else if (bIsClickedDesign) {
                    console.log(bIsClickedDesign);
                }
                else if (bIsClickedDatabase) {
                    console.log(bIsClickedDatabase);
                }
                else if (bIsClickedEmail) {
                    const emailValue = bIsClickedEmail.querySelector('.email_value')?.textContent;
                    if (emailValue) {
                        navigator.clipboard.writeText(emailValue)
                            .then(() => {
                                alert('이메일이 클립보드에 복사되었습니다.');
                            })
                            .catch(err => {
                                console.error('클립보드 복사 실패:', err);
                            });
                    }
                }
                break;
            }
        }
    });

    // 4. ChangeHandler - 소개글 변경
    const handleChange = useChangeHandler((e: React.ChangeEvent, value: string) => {
        const target = e.target as HTMLElement;
        const bIsChangedMotivation = target.classList.contains('motivation');
        const bIsChangedGrowth = target.classList.contains('growth');
        const bIsChangedAdventage = target.classList.contains('adventage');
        const bIsChangedGoals = target.classList.contains('goals');

        if (!localIntroduction) return;

        switch (true) {
            case bIsChangedMotivation: {
                setLocalIntroduction({
                    ...localIntroduction,
                    motivation: value
                });
                break;
            }
            case bIsChangedGrowth: {
                setLocalIntroduction({
                    ...localIntroduction,
                    growth: value
                });
                break;
            }
            case bIsChangedAdventage: {
                setLocalIntroduction({
                    ...localIntroduction,
                    adventage: value
                });
                break;
            }
            case bIsChangedGoals: {
                setLocalIntroduction({
                    ...localIntroduction,
                    goals: value
                });
                break;
            }
        }
    });

    // 로딩 상태 처리
    const isLoading = isUserLoading || isIntroductionLoading;
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <Loading />
                    <p className="text-gray-600 mt-4">데이터를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    // 에러 상태 처리
    const hasError = isUserError || isIntroductionError;
    if (hasError) {
        return (
            <div className="error-container p-8 max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-xl font-bold text-red-700 mb-4">데이터를 불러오는데 문제가 발생했습니다</h3>
                {isUserError && (
                    <p className="text-red-600 mb-2">사용자 정보: {userError instanceof Error ? userError.message : '알 수 없는 오류'}</p>
                )}
                {isIntroductionError && (
                    <p className="text-red-600 mb-4">자기소개서: {introductionError instanceof Error ? introductionError.message : '알 수 없는 오류'}</p>
                )}
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 뮤테이션 로딩 상태 확인
    const isMutationLoading = motivationMutation.isPending || growthMutation.isPending || adventageMutation.isPending || goalsMutation.isPending;

    return (
        <div id='introduce' className='flex h-full'>
            <section className='profile_section bg-introduce-aside-color w-[350px] h-full text-aside-primary overflow-auto'>
                <article className='side_inner_shell h-full flex items-center flex-col'>
                    <div className='profile_img_box w-[200px] !mt-[60px]'>
                        <img src={`${import.meta.env.VITE_UPLOAD_PATH}/profile.png`} />
                    </div>
                    <div className='info_box w-full !mb-[60px]'>
                        <VariableInfo
                            layout="vertical"
                            className='font-bold text-[1em] !mt-[50px] !px-[40px]'
                            fields={[
                                {
                                    type: 'div',
                                    label: `이름 :`,
                                    value: user?.name,
                                    className: 'user_name flex tracking-[15px] !mb-[10px]',
                                    infoDivClassName: '!ml-[20px] tracking-[30px]'
                                },
                                {
                                    type: 'div',
                                    label: '생일 :',
                                    value: user?.birth,
                                    className: 'user_birth flex tracking-[15px] !mb-[10px]',
                                    infoDivClassName: '!ml-[20px] tracking-[2px]'
                                },
                                {
                                    type: 'div',
                                    label: '주소 : ',
                                    value: user?.addr,
                                    className: 'user_addr flex tracking-[15px] !mb-[10px]',
                                    infoDivClassName: '!ml-[20px] tracking-[1px]',
                                },
                                {
                                    type: 'div',
                                    label: '연락처 : ',
                                    value: user?.contacts,
                                    className: 'user_birth flex tracking-[7px] !mb-[10px]',
                                    infoDivClassName: '!ml-[30px] tracking-[1px]',
                                },
                                {
                                    type: 'div',
                                    label: '이메일 : ',
                                    value: user?.email,
                                    onClick: handleClick,
                                    className: 'user_email flex tracking-[7px] cursor-pointer !mb-[10px]',
                                    infoDivClassName: 'email_value !ml-[30px] text-[0.7em] tracking-[0px]',
                                },
                                {
                                    type: 'div',
                                    label: '대학교 : ',
                                    value: user?.university,
                                    onClick: handleClick,
                                    className: 'user_email flex tracking-[7px] cursor-pointer',
                                    infoDivClassName: 'email_value !ml-[30px] tracking-[10px] flex items-center',
                                },
                            ]}
                        />
                    </div>
                    <div className='skill_box w-[80%] border-t-2'>
                        <p className='font-bold !mb-[30px]'>기술/SKILL 상세보기클릭</p>
                        <VariableInfo
                            layout="vertical"
                            className='font-bold text-[1em] w-full'
                            fields={[
                                {
                                    type: 'range',
                                    label: 'Front End',
                                    steps: 10,
                                    filledSteps: 7,
                                    onClick: handleClick,
                                    blockWidth: '25px',
                                    blockHeight: '18px',
                                    className: 'front_end skill-range !mb-4 cursor-pointer'
                                },
                                {
                                    type: 'range',
                                    label: 'Back End',
                                    steps: 10,
                                    filledSteps: 8,
                                    onClick: handleClick,
                                    blockWidth: '25px',
                                    blockHeight: '18px',
                                    className: 'back_end skill-range !mb-4 cursor-pointer'
                                },
                                {
                                    type: 'range',
                                    label: 'UI/UX 디자인',
                                    steps: 10,
                                    filledSteps: 6,
                                    onClick: handleClick,
                                    blockWidth: '25px',
                                    blockHeight: '18px',
                                    className: 'design skill-range !mb-4 cursor-pointer'
                                },
                                {
                                    type: 'range',
                                    label: 'Database',
                                    steps: 10,
                                    filledSteps: 8,
                                    onClick: handleClick,
                                    blockWidth: '25px',
                                    blockHeight: '18px',
                                    className: 'db skill-range !mb-4 cursor-pointer'
                                },
                            ]}
                        />
                    </div>
                </article>
            </section>
            <section className='content_section flex-grow h-full overflow-auto scrollbar-none'>
                {isMutationLoading && (
                    <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md flex items-center">
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        저장 중...
                    </div>
                )}
                <article className='content_inner_shell flex flex-col !px-[15%]'>
                    <div className='conner_ribon'></div>
                    <div className='title_box !mt-[100px] border-b flex items-end'>
                        <span className='font-extrabold text-[4em] !mr-[140px]'>이상훈</span>
                        <span>Sang-Hun Lee</span>
                    </div>
                    <div className='desc_box !mt-[5px]'>
                        <span className='text-gray-400 font-bold'>누구보다 잘하는 1년차가 되고싶은 개발자</span>
                    </div>
                    <div className='motivation_title_box !mt-[100px] border-b flex justify-between'>
                        <span className='font-extrabold text-[2em] !mr-[140px]'>지원동기</span>
                        <div className='flex gap-2 items-end'>
                            <CommonBtn
                                buttonName={isEditing[0].isEditing ? '수정완료' : '수 정'}
                                onClick={handleClick}
                                className={`!mb-2 put_moti !mr-2 ${motivationMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                    <div className='motivation_content_box !mt-[5px] text-primary'>
                        {isEditing[0].isEditing ? (
                            <div>
                                <textarea
                                    rows={10}
                                    className='motivation block p-2.5 w-full text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    onChange={(e) => handleChange ? handleChange(e) : undefined}
                                    value={localIntroduction?.motivation || ''}
                                    disabled={motivationMutation.isPending}
                                ></textarea>
                            </div>
                        ) : (
                            <div className='text-gray-900 bg-gray-50'>
                                {localIntroduction?.motivation}
                            </div>
                        )}
                    </div>
                    <div className='growth_title_box !mt-[100px] border-b flex justify-between'>
                        <span className='font-extrabold text-[2em] !mr-[140px]'>성장과정</span>
                        <div className='flex gap-2 items-end'>
                            <CommonBtn
                                buttonName={isEditing[1].isEditing ? '수정완료' : '수 정'}
                                onClick={handleClick}
                                className={`!mb-2 put_growth !mr-2 ${growthMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                    <div className='growth_content_box !mt-[5px] text-primary'>
                        {isEditing[1].isEditing ? (
                            <div>
                                <textarea
                                    rows={10}
                                    className='growth block p-2.5 w-full text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    onChange={(e) => handleChange ? handleChange(e) : undefined}
                                    value={localIntroduction?.growth || ''}
                                    disabled={growthMutation.isPending}
                                ></textarea>
                            </div>
                        ) : (
                            <div className='text-gray-900 bg-gray-50'>
                                {localIntroduction?.growth}
                            </div>
                        )}
                    </div>
                    <div className='adventage_title_box !mt-[100px] border-b flex justify-between'>
                        <span className='font-extrabold text-[2em] !mr-[140px]'>장단점</span>
                        <div className='flex gap-2 items-end'>
                            <CommonBtn
                                buttonName={isEditing[2].isEditing ? '수정완료' : '수 정'}
                                onClick={handleClick}
                                className={`!mb-2 put_adv !mr-2 ${adventageMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                    <div className='adventage_content_box !mt-[5px] text-primary'>
                        {isEditing[2].isEditing ? (
                            <div>
                                <textarea
                                    rows={10}
                                    className='adventage block p-2.5 w-full text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    onChange={(e) => handleChange ? handleChange(e) : undefined}
                                    value={localIntroduction?.adventage || ''}
                                    disabled={adventageMutation.isPending}
                                ></textarea>
                            </div>
                        ) : (
                            <div className='text-gray-900 bg-gray-50'>
                                {localIntroduction?.adventage}
                            </div>
                        )}
                    </div>
                    <div className='aspiration_title_box !mt-[100px] border-b flex justify-between'>
                        <span className='font-extrabold text-[2em] !mr-[140px]'>포부</span>
                        <div className='flex gap-2 items-end'>
                            <CommonBtn
                                buttonName={isEditing[3].isEditing ? '수정완료' : '수 정'}
                                onClick={handleClick}
                                className={`!mb-2 put_goals !mr-2 ${goalsMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                    <div className='aspiration_content_box !mb-[200px]'>
                        {isEditing[3].isEditing ? (
                            <div>
                                <textarea
                                    rows={10}
                                    className='goals block p-2.5 w-full text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    onChange={(e) => handleChange ? handleChange(e) : undefined}
                                    value={localIntroduction?.goals || ''}
                                    disabled={goalsMutation.isPending}
                                ></textarea>
                            </div>
                        ) : (
                            <div className='text-gray-900 bg-gray-50'>
                                {localIntroduction?.goals}
                            </div>
                        )}
                    </div>
                </article>
            </section>
        </div>
    )
}

export default Introduce