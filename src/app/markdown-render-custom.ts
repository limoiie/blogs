import {MarkedOptions, MarkedRenderer} from 'ngx-markdown';


export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  // custom render style
  // renderer.blockquote = (text: string) => {
  //   return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
  // };

  return {
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}
