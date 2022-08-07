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

  lastChild(): TreeNode<T> {
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

  * toStream_(): Generator<T | null, void> {
    let curr: TreeNode<T> | null = this
    while (curr) {
      yield curr.data
      curr = curr.next()
    }
    yield null
  }
}
