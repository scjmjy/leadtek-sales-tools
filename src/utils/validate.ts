export function validatePassword(password: string) {
  let count = 0; // 满足的规则数量
  const digital = /[0-9]/; // 数字正则
  const uppercase = /[A-Z]/; // 大写字母正则
  const lowercase = /[a-z]/; // 小写字母正则
  const spec = /[,.<>{}~!@#$%^&*_]/; // 特殊字符正则

  // 判断密码是否包含数字
  if (digital.test(password)) {
    count++;
  }

  // 判断密码是否包字母
  if (lowercase.test(password) || uppercase.test(password)) {
    count++;
  }

  // 判断密码是否同时包含大小写;
  // if (lowercase.test(password) && uppercase.test(password)) {
  // 	count++;
  // }

  // 判断密码是否包含特殊字符
  if (spec.test(password)) {
    count++;
  }
  return count >= 2;
}
