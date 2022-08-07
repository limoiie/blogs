/* eslint-disable @typescript-eslint/no-this-alias */
export class TreeNode<T> {
  data: T
  parent: TreeNode<T> | null
  private cousin: TreeNode<T> | null
  private readonly mChildren: TreeNode<T>[]

  constructor(
    data: T,
    parent: TreeNode<T> | null = null,
    cousin: TreeNode<T> | null = null,
    children: TreeNode<T>[] = []
  ) {
    this.data = data
    this.parent = parent
    this.cousin = cousin
    this.mChildren = children
  }

  get children(): TreeNode<T>[] {
    return this.mChildren
  }

  firstChild(): TreeNode<T> | null {
    return this.mChildren[0]
  }

  lastChild(): TreeNode<T> | null {
    return this.mChildren[this.mChildren.length - 1]
  }

  appendChild(child: TreeNode<T>): TreeNode<T> {
    child.parent = this
    this.lastChild()?.setCousin(child)
    this.mChildren.push(child)
    return child
  }

  private setCousin(cousin: TreeNode<T>) {
    this.cousin = cousin
  }

  next(): TreeNode<T> | null {
    if (this.mChildren.length > 0) {
      return this.mChildren[0]
    }
    if (this.cousin) {
      return this.cousin
    }

    let parent = this.parent
    while (parent) {
      if (parent?.cousin) {
        return parent.cousin
      }
      parent = parent.parent
    }
    return null
  }

  find(compare: (a: T, b: T | undefined) => -1 | 0 | 1): TreeNode<T>[] {
    if (this.children.length == 0 ||
      compare(this.data, this.firstChild()?.data) == 0) {
      return [this]
    }

    let l = 0, r = this.children.length
    while (l < r) {
      const m = (l + r) >> 1
      switch (compare(this.children[m].data, this.children[m + 1]?.data)) {
      case 0:
        return [this, ...this.children[m].find(compare)]
      case 1:
        l = m + 1
        break
      case -1:
        r = m
        break
      }
    }

    return this.children[l] ? [this.children[l]] : []
  }
}
