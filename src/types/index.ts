export interface PkgInfo {
  /**包名 */
  name: string;
  /**包名简介信息 */
  related_package_desc: string;
  /**相似包名 */
  related_package_names: string[];
  score: {
    final: number;
    detail: {
      maintenance: number; // 维护性
      popularity: number; // 流行度
      quality: number; // 质量
    };
  };
}
