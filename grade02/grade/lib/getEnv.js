let isTest = true; 

// 'develop'开发版  'trial'体验版,   'release'正式版

if (__wxConfig.envVersion) {

  console.log('+++++++++++++++++++')
  console.log(__wxConfig.envVersion)
  console.log('+++++++++++++++++++')

  let env = __wxConfig.envVersion;
  if (env =='develop') {
    isTest = true
  } else if (env == 'trial'){
    isTest = true
  } else if (env == 'release') {
    isTest = false
  }
}

const testApi =  'https://teacher.yuangaofen.com.cn/'

const prodApi = 'https://teacher.yuangaofen.com/'

let Api = isTest ? testApi : prodApi;

module.exports = Api;