import Request from './httpServer'
// phone=17623874916&code=919191


let SEVER_HOST = require('./getEnv.js');
// const SEVER_HOST = 'https://teacher.yuangaofen.com/'; //微信小程序域名 
// const SEVER_HOST = 'https://192.168.0.184:8080/';

export const login = params => { return new Request().post(`${SEVER_HOST}interface/user_system/text_Login`, params) }

export const getSelfInfo = params => { return new Request().post(`${SEVER_HOST}interface/teacher/get_self_info`, params) }

export const getMyClass = params => { return new Request().post(`${SEVER_HOST}interface/teacher/get_my_classes`, params) }

export const getGradeKaoshiList = params => { return new Request().post(`${SEVER_HOST}interface/teacher/getGradeKaoshiList`, params) }

export const lookThreeRate = params => { return new Request().post(`${SEVER_HOST}interface/ScoreAnalyze/lookThreeRate`, params) }

export const getClassAvgMaxCompareGrade_And_threeRate = params => { return new Request().post(`${SEVER_HOST}interface/teacher/getClassAvgMaxCompareGrade_And_threeRate`, params) }

export const getTopAndLast = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getTopAndLast`, params) }

export const getStudentScoreInClass = params => { return new Request().post(`${SEVER_HOST}interface/teacher/getStudentScoreInClass`, params) }

export const getRate = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getRate`, params) }

export const getAvgMaxTrend_forClassAndGrade = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getAvgMaxTrend_forClassAndGrade`, params) }

export const getClassRate = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getClassRate`, params) }

export const getTitle = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getTitle`, params) }

export const get_exam_data = params => { return new Request().post(`${SEVER_HOST}interface/Analysis_add/get_exam_data`, params) }

export const getAllByClass = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getAllByClass`, params) }

export const get_xk_info = params => { return new Request().post(`${SEVER_HOST}interface/student/get_xk_info`, params) }

export const get_xk_rank_percent = params => { return new Request().post(`${SEVER_HOST}interface/student/get_xk_rank_percent`, params) }

export const getAvgMaxTrend_forClassAndGradeTwo = params => { return new Request().post(`${SEVER_HOST}interface/knowledge_analyse/getAvgMaxTrend_forClassAndGrade`, params) }



/*评卷页面*/
// export const getExamlist = params=>{return new Request().post(`${SEVER_HOST}examManage/getExamlist`,params)}

export const simulated = params => { return new Request().post(`${SEVER_HOST}userManage/signIn`, params) }

export const findAllexaminfo = params => { return new Request().get(`${SEVER_HOST}examQuestion/findAllExamInfo/${params.examId}`) }

export const getUnchecked = params => { return new Request().get(`${SEVER_HOST}examQuestion/getUncheckedTopic/${params.examId}/${params.questionId}`) }

export const updateTopic = params => { return new Request().post(`${SEVER_HOST}examQuestion/updateTopic`, params, { 'Content-Type': 'application/json' }) }

// export const exportExamDataQuestion = params=>{return new Request().post(`${SEVER_HOST}examManage/exportExamDataQuestion`,params)}

export const topicRule = params => { return new Request().post(`${SEVER_HOST}examQuestion/updateTopicRule/${params.questionId}`, params.rule, { 'Content-Type': 'application/json' }) }

export const findChecked = params => { return new Request().get(`${SEVER_HOST}examQuestion/findCheckedTopic/${params.id}/${params.examId}/${params.questionId}/${params.type}/${params.page}`) }
// export const findChecked = params => { return new Request().post(`${SEVER_HOST}examQuestion/findCheckedTopic`, params, { 'Content-Type': 'application/json' }) }

export const exportExamInfo = params => { return new Request().post(`${SEVER_HOST}examManage/exportExamDataStudent`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }

export const findStudentUion = params => { return new Request().get(`${SEVER_HOST}examQuestion/findStudentUionExamList/${params.examId}/${params.questionId}`) }

export const getCollect = params => { return new Request().get(`${SEVER_HOST}examQuestion/getCollectTopic/${params.examId}/${params.questionId}`) }

export const updateCollect = params => { return new Request().post(`${SEVER_HOST}examQuestion/updateCollectAndTag/${params.questionId}`, params.data, { 'Content-Type': 'application/json' }) }

export const getTags = params => { return new Request().get(`${SEVER_HOST}examQuestion/getTagList/${params.questionId}`)}

export const updateRule = params => { return new Request().post(`${SEVER_HOST}examQuestion/updateTopicRule/${params.examId}/${params.questionId}`, params, { 'Content-Type': 'application/json' }) }

export const deleteCollect = params => { return new Request().get(`${SEVER_HOST}examQuestion/cancelConllectAll`, params)}

export const postExamResultTime = params => { return new Request().post(`${SEVER_HOST}examQuestion/addExamEndTime/${params.examId}`, params, { 'Content-Type': 'application/json' })}

export const getStudentUnionExamMore = params => { return new Request().get(`${SEVER_HOST}examQuestion/getPageStudentUnionExam/${params.examId}/${params.questionId}/${params.page}`)}

/* 个人 界面 */
export const getScanList = params => { return new Request().get(`${SEVER_HOST}scanTheManage/getScanTheList`, params) }
export const getScanList2 = params => { return new Request().get(`${SEVER_HOST}scanTheManage/getScanTheList2`, params) }
export const removeScaner = params => { return new Request().post(`${SEVER_HOST}scanTheManage/removeScanThe`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }
export const getMyinformation = params => { return new Request().post(`${SEVER_HOST}studentUnionManager/getMyInformation`, params) }
export const getMyclass = params => { return new Request().post(`${SEVER_HOST}studentUnionManager/getMyClass`, params) }
export const getMystudentList = params => { return new Request().post(`${SEVER_HOST}studentUnionManager/getMyStudentList`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }
export const getUnionStudentList = params => { return new Request().post(`${SEVER_HOST}studentUnionManager/getUnionStudentList`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }
export const updateUnionParent = params => { return new Request().post(`${SEVER_HOST}studentUnionManager/updateUnionParent`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }
export const bindInfos = params => { return new Request().post(`${SEVER_HOST}userManage/bindInfo`, params, { 'Content-Type': 'application/x-www-form-urlencoded' }) }
export const getSchoolLists = params => { return new Request().post(`${SEVER_HOST}manage/getSchoolList?school=${encodeURIComponent(params.school)}`) }

// 钉钉小程序
/* {
  phone：'', 13272670720
  type:'', 验证码,类型 1,注册 2, 登录 3,找回密码
}*/
export const sendCode = params => {
    return new Request().post(`${SEVER_HOST}userManage/sendCode`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const getInfo = params => { return new Request().get(`${SEVER_HOST}userManage/getInfo`, params) }

export const checkPhone = params => { return new Request().get(`${SEVER_HOST}userManage/checkPhone`, params) }

/* {
  phone：'', 13272670720
  type:'', 选择登录类型:1 短信,2 密码
  cont:'' 密码/或者短信验证码
}*/
export const signIn = params => { return new Request().get(`${SEVER_HOST}userManage/signIn`, params) }

export const updateInfo = params => { return new Request().get(`${SEVER_HOST}userManage/updateInfo`, params) }

/* {
  phone：'', 13272670720
  code:'', 验证码
  pwd:'' 密码
}*/
export const signUp = params => { return new Request().get(`${SEVER_HOST}userManage/signUp`, params) }

export const bindScanThe = params => { return new Request().get(`${SEVER_HOST}scanTheManage/bindScanThe`, params) }

/* {
  examId:'', 1
}*/
export const examInforMation = params => {
    return new Request().post(`${SEVER_HOST}examManage/examInforMation`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

// requestMap :{

// }
export const updateStructer = params => { return new Request().postOther(`${SEVER_HOST}examManage/updateStructer`, params) }

export const getSchoolList = params => { return new Request().post(`${SEVER_HOST}manage/getSchoolList?school=` + encodeURIComponent(params)) }

export const dingtalk = params => { return new Request().post(`${SEVER_HOST}OAuth/dingtalk`, params) }

export const getExamProgress = params => { return new Request().post(`${SEVER_HOST}examManage/getExamProgress`, params) }

// export const getScanningProgress = params => { return new Request().post(`${SEVER_HOST}scanTheManage/getScanningProgress`,params)}

// export const exportExamDataStudent = params => { return new Request().post(`${SEVER_HOST}examManage/exportExamDataStudent`,params)}

// export const updateExamStatus = params => { return new Request().post(`${SEVER_HOST}/examManage/updateExamStatus`,params)}

export const sanqr = params => {
    return new Request().post(`${SEVER_HOST}/scanTheManage/sanqr`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const resetPassword = params => { return new Request().post(`${SEVER_HOST}/userManage/resetPassword`, params) }


// 成绩分析
export const getStudentName = params => { return new Request().get(`${SEVER_HOST}analysisStudent/getStudentName`, params) }

export const getStudentInfor = params => {
    return new Request().post(`${SEVER_HOST}analysisStudent/getStudentInfor`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const getAllExamByExamId = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getAllExamByExamId/${params.id}`) }

export const getExamGeneal = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getExamGeneal/${params.id}`) }

export const getExamInfoByExamid = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getExamInfoByExamid/${params.id}`) }

export const getRankInfo = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getRankInfo/${params.id}`) }

export const getThreeModulusInfo = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getThreeModulusInfo/${params.id}`) }

export const getTopicScopeCondition = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getTopicScopeCondition/${params.id}`) }

export const setThreeModulus = params => { return new Request().post(`${SEVER_HOST}scoreAnalyze/setThreeModulus`, params) }

export const wechatapplet = params => {
    return new Request().post(`${SEVER_HOST}OAuth/wechatapplet`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const bindInfo = params => {
    return new Request().post(`${SEVER_HOST}/userManage/bindInfo`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const getSubject = params => {
    return new Request().post(`${SEVER_HOST}/examManage/getSubject`, params)
}

export const getChoiceRate = params => {
    return new Request().get(`${SEVER_HOST}analysisStudent/getChoiceRate/${params.id}`)
}

export const errExamLog = params => {
        return new Request().post(`${SEVER_HOST}/examManage/errExamLog`, params, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }
    /* 
    评卷课件数据管理
    GET /examCourseware/getExamInfo/{examId} 封面信息获取
    GET /examCourseware/getQuestionList/{examId} 获取本次考试的评卷
    GET /examCourseware/getRatio 获取评卷的平均得分和得分率
    GET /examCourseware/getSelectRatio 获取选择题的数据比较
    GET /examCourseware/getSubjective 获取主观题的数据比较
    GET /examCourseware/getSectionInfo 获取各区间的信息集合
    GET /examCourseware/getAcquaintanceTopic/{questionId} 获取相似题
     */
export const getCourseExamInfo = params => { return new Request().get(`${SEVER_HOST}examCourseware/getExamInfo/${params.id}`) }
export const getCourseQuestionList = params => { return new Request().get(`${SEVER_HOST}examCourseware/getQuestionList/${params.id}`) }
export const getCourseRatio = params => { return new Request().get(`${SEVER_HOST}examCourseware/getRatio?examId=${params.id}&questionId=${params.qid}`) }
export const getCourseSelectRatio = params => { return new Request().get(`${SEVER_HOST}examCourseware/getSelectRatio?examId=${params.id}&questionId=${params.qid}`) }
export const getCourseSubjective = params => { return new Request().get(`${SEVER_HOST}examCourseware/getSubjective?examId=${params.id}&questionId=${params.qid}`) }
export const getCourseSectionInfo = params => { return new Request().get(`${SEVER_HOST}examCourseware/getSectionInfo?examId=${params.id}&questionId=${params.qid}&sectionType=${params.type}`) }

export const courseOauth = params => {
  return new Request().post(`${SEVER_HOST}Courseware/OAuth`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  }) }
export const getAcquaintanceTopic = params => { return new Request().get(`${SEVER_HOST}examCourseware/getAcquaintanceTopic/${params.id}`)}

//考试管理  
export const CreateExam = params => { return new Request().post(`${SEVER_HOST}examManage/createExam`, params) }
export const getExamlist = params => { return new Request().post(`${SEVER_HOST}examManage/getExamlist`, params) }
export const updateExamStatus = params => {
        return new Request().post(`${SEVER_HOST}examManage/updateExamStatus`, params, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }
    //扫描
export const UExamStd = params => {
    return new Request().post(`${SEVER_HOST}examManage/uExamStd`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const exportExamDataQuestion = params => {
    return new Request().post(`${SEVER_HOST}examManage/exportExamDataQuestion`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const exportExamDataStudent = params => {
    return new Request().post(`${SEVER_HOST}examManage/exportExamDataStudent`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const GetScanTheList = params => {
  return new Request().post(`${SEVER_HOST}scanTheManage/getScanTheList`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  }) }
export const GetScanningProgress = params => { return new Request().get(`${SEVER_HOST}scanTheManage/getScanningProgress`, params) }

export const ConfirmTest = params => {
    return new Request().post(`${SEVER_HOST}scanTheManage/confirmTest`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const AuthCode = params => {
        return new Request().post(`${SEVER_HOST}scanTheManage/authCode`, params, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }
    //成绩预览
export const getScoreResult = params => {
    return new Request().post(`${SEVER_HOST}examManage/getScoreResult`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}
export const publishedResults = params => {
    return new Request().post(`${SEVER_HOST}examManage/publishedResults`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}
export const updateStudentName = params => {
    return new Request().post(`${SEVER_HOST}examManage/updateStudentName`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const getIssueStatus = params => {
    return new Request().get(`${SEVER_HOST}scoreAnalyze/getIssueStatus`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const analyzeUpdateExamStatus = params => {
    return new Request().get(`${SEVER_HOST}/scoreAnalyze/updateExamStatus`, params, {
        'Content-Type': 'application/x-www-form-urlencoded'
    })
}

export const OAuth = params => {
    return new Request().post(`${SEVER_HOST}/Courseware/OAuth`, params)
}


export const updateExamIsDoubAndPage = params => {
  return new Request().post(`${SEVER_HOST}/examManage/updateExamIsDoubAndPage`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}


// 错题集
export const studentList = params => {
  return new Request().post(`${SEVER_HOST}/mistakesCollection/studentList`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export const studentMisTakeInfo = params => {
  return new Request().post(`${SEVER_HOST}mistakesCollection/studentMisTakeInfo`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export const questionInfo = params => {
  return new Request().post(`${SEVER_HOST}/mistakesCollection/questionInfo`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}


//班级报告

export const getExamBaseInfo = params => {return new Request().get(`${SEVER_HOST}/examAnalyze/getExamBaseInfo/${params.id}`)}

export const getAdvance = params => { return new Request().get(`${SEVER_HOST}/examAnalyze/getAdvance/${params.id}/${params.type}`) }

export const getQuestionChoiceRateList = params => { return new Request().get(`${SEVER_HOST}/examAnalyze/getQuestionChoiceRateList/${params.id}`) }

export const getQuestionChoiceRateListPost = params => { return new Request().post(`${SEVER_HOST}examAnalyze/getQuestionChoiceRateList?examId=${params.examId}`,params.list) }

export const getMarkingInfoList = params => { return new Request().get(`${SEVER_HOST}/examAnalyze/getMarkingInfoList/${params.id}`) }

export const getBaseSubsectionNumber = params => { return new Request().get(`${SEVER_HOST}/examAnalyze/getBaseSubsectionNumber/${params.id}`) }

export const getAllExamByTeachrId = params => { return new Request().get(`${SEVER_HOST}scoreAnalyze/getAllExamByTeachrId`) }


export const difficultyInfo = params => {
  return new Request().post(`${SEVER_HOST}/analysisStudent/difficultyInfo`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export const getKnowledgePoint = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/getKnowledgePoint/${params.id}/${params.start}/${params.type}/${params.studentId}`)
}

export const getAssignRnakAvg = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/getAssignRnakAvg/${params.id}/${params.num}`)
}

export const getDiyRate = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/getDiyRate?examId=${params.id}&arg1=${params.arg1}&arg2=${params.arg2}&type=${params.type}`)
}

export const getTopicunionStudent = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/getTopicunionStudent/${params.id}/${params.questionId}`)
}


export const asyncCallCalculate = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/asyncCallCalculate/${params.examId}`)
}

export const updateName = params => {
  return new Request().post(`${SEVER_HOST}analysisStudent/updateName`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export const getStatus = params => {
  return new Request().post(`${SEVER_HOST}examCourseware/getStatus`, params)
}

export const inStatus = params => {
  return new Request().post(`${SEVER_HOST}examCourseware/inStatus`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}


export const updateSchoolClass = params => {
  return new Request().post(`${SEVER_HOST}examManage/updateSchoolClass`, params, {
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export const getKnowledgeStudentList = params => {
  return new Request().get(`${SEVER_HOST}examAnalyze/getKnowledgeStudentList/${params.examId}/${params.xid}`)
}