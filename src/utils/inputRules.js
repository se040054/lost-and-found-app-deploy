export const userRules = {
  password: {
    regex: /^(?=.*\d)(?=.*[a-zA-Z])[^\s]{3,30}$/,
    prompt: '3~30字元，必須包含英文、數字，不能使用空格 ，',
    min: 3,
    max: 30
    //非捕獲組的用意為優化性能
  },
  name: {
    regex: /^[a-zA-Z0-9_.\u4e00-\u9fa5-]{1,16}$/,
    prompt: '1-16個字元，中文、英文、數字、符號(_-.)不能含有空白',
    min: 1,
    max: 16
    //非捕獲組的用意為優化性能
  },
  email: {
    regex: /^(?:\w+(?:[.-]?\w+)*@\w+(?:[.-]?\w+)*(\.\w{2,3})+)$/,
    prompt: '請輸入正確信箱格式',
    min: 6,
    max: 64
  },
  phone: {
    regex: /^(?:\d{9}|\d{10})$/,
    prompt: "必須是9-10位數字",
    min: 9,
    max: 10
  },
  county: {
    regex: /^(?:[\u4e00-\u9fa5a-zA-Z\x20\-']+)$/,
    prompt: "2-16字元，只能輸入中文、英文、符號",
    min: 2,
    max: 16
  }
};

export const merchantRules = {
  name: {
    regex: /^[a-zA-Z0-9_.\u4e00-\u9fa5-]{1,16}$/,
    prompt: '1-16個字元，中文、英文、數字、符號(_-.)不能含有空白',
    min: 1,
    max: 16
    //非捕獲組的用意為優化性能
  },
  phone: {
    regex: /^(?:\d{9}|\d{10})$/,
    prompt: "必須是9-10位數字",
    min: 9,
    max: 10
  },
  address: {
    regex: /^[a-zA-Z0-9_.\u4e00-\u9fa5-]{6,60}$/,
    prompt: '6-60個字元，中文、英文、數字、符號(_-.)不能含有空白',
    min: 6,
    max: 60
    //非捕獲組的用意為優化性能
  },
}

export const itemRules = {
  name: {
    regex: /.{2,20}/,
    prompt: "2-20個字元",
    min: 2,
    max: 20
  },
  description: {
    regex: /.{0,200}/,
    prompt: "0-200個字元",
    min: 0,
    max: 200
  },
  place: {
    regex: /.{0,40}/,
    prompt: "0-40個字元",
    min: 0,
    max: 40
  },
}