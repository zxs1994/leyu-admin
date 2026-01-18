export const phoneRule = [{
    required: true,
    message: '请输入手机号',
    trigger: ['blur'],
  },
  {
    pattern: /^1\d{10}$/,
    message: '请输入正确的手机号',
    trigger: 'blur',
  },
]
const Rules = {
  name: [{
      required: true,
      message: '请输入名称',
      trigger: ['blur'],
    },
    {
      min: 2,
      max: 20,
      message: '请输入2-20个字符',
      trigger: ['blur'],
    },
  ],
  email: [{
      required: true,
      message: '请输入邮箱',
      trigger: ['blur'],
    },
    {
      pattern: /^[\w\.\-]+@[\w\.\-]+\.[a-z]{2,4}$/,
      message: '请输入正确的邮箱',
      trigger: 'blur',
    },
  ],
  code: [{
      required: true,
      message: '请输入验证码',
      trigger: ['blur'],
    },
    {
      pattern: /^\d{6}$/,
      message: '请输入6位数字',
      trigger: 'blur',
    },
  ],
  phone: phoneRule,
  username: [{
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    },
    {
      min: 3,
      message: '账号不能少于3个字符',
      trigger: 'blur'
    },
    {
      pattern: /^[A-Za-z0-9]+$/,
      message: '账号只能包含字母和数字',
      trigger: 'blur'
    }
  ],
  password: [{
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码不能少于6位',
      trigger: 'blur'
    },
    {
      pattern: /^[A-Za-z0-9]+$/,
      message: '密码只能包含字母和数字',
      trigger: 'blur'
    }
  ],
  // password: [{
  //     required: true,
  //     message: '请输入密码',
  //     trigger: ['blur'],
  //   },
  //   {
  //     min: 8,
  //     max: 32,
  //     message: '密码长度必须在8-32个字符',
  //     trigger: 'blur',
  //   },
  //   {
  //     pattern: /^(?![0-9]+$)(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/,
  //     message: '密码必须且只能包含大小写英文字母和数字',
  //     trigger: 'blur',
  //   },
  // ],
  url: [{
    pattern: /^http[s]?:\/\//,
    message: '请输入正确的网址, http[s]?://',
    trigger: 'blur',
  }, ],
}

export default Rules