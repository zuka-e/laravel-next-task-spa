/** パスを構成する要素の内、モデルに対応するパス名 */
type PathNames = ['users', 'task-boards', 'task-lists', 'task-cards'];

/** `pathName`と`id`(省略可)との組み合わせ */
type PathSet = [pathName: PathNames[number], id?: string];

/** `PathSet`の配列(可変長)を連結してパスを作成 */
export const makePath = (...props: PathSet[]) => {
  const reducer = (acc: string, current: (typeof props)[0]) => {
    const pathName = current[0];
    const id = current[1];
    return acc + `/${pathName}` + (id ? `/${id}` : '');
  };
  const path = props.reduce(reducer, '');
  return path;
};
