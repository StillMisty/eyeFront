// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default withNuxt(
  // {
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off", // 关闭禁止使用any的规则
  //     "@typescript-eslint/no-unsafe-assignment": "off", // 关闭禁止将any类型值分配给变量的规则
  //     "@typescript-eslint/no-unsafe-member-access": "off", // 关闭禁止对any类型值进行成员访问的规则
  //     "@typescript-eslint/no-unsafe-call": "off", // 关闭禁止调用any类型值作为函数的规则
  //     "@typescript-eslint/no-unsafe-return": "off", // 关闭禁止返回any类型值的规则
  //   },
  // },
  eslintConfigPrettier,
);
