// https://github.com/laudeon/drive-folder-tree/
// @author laudeon
// MIT licensed


const findById = (folders, id) => {
  let folder = folders.find(folder => folder.id === id)
  if (!folder) folder = { name: 'root', id: null }

  return folder
}

const findByParentId = (folders, parentId) =>
  folders.filter(folder => folder.parents && folder.parents[0] === parentId)

const existInTree = function (tree, id) {
  if (tree.find(folder => folder.id === id)) return true

  let result = false
  for (const folder in tree) {
    if (folder.hasOwnProperty('children') && folder.children.length) {
      result = existInTree(folder.children, id)
      if (result) return result
    }
  }

  return result
}

const createBranch = (folders, folder) => {
  folder.children = findByParentId(folders, folder.id)

  if (folder.children.length > 0) {
    folder.children.forEach(child => {
      createBranch(folders, child)
    })
  }
}

const makeTree = (folders, opts = {}) => {
  const tree = []

  folders.forEach(folder => {
    if (
      !existInTree(tree, folder.id) &&
      folder.parents ? findById(folders, folder.parents[0]).name === 'root' : true
      ) {
        // This condition can't be combined with the parent if-statement.
        // Somehow folder.parents value differs between the two
      if (opts.rootId ? folder.parents?.[0] === opts.rootId : true) {
        createBranch(folders, folder)
        tree.push(folder)
      }
    }
  })
  return tree
}

export default (folders, opts) => makeTree(folders, opts)