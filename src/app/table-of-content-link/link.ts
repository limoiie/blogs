export interface Link {
  /* id of the section*/
  id: string
  /* header level */
  level: number
  /* header type h1/h2/h3/h4 */
  type: string
  /* whether the anchor is in view of the page or not */
  active: boolean
  /* whether the children are expanded */
  expanded: boolean
  /* name of the anchor */
  name: string
  /* top offset px of the anchor */
  top: number
}
