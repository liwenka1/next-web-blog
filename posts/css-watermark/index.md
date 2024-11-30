---
title: Watermark 水印组件
date: 2024-04-12
description: Watermark 水印组件的简单实现
---

## 前言

## Watermark 组件

export const Watermark = ({ text = '', mountElement = '', color }) => {
  const _text = text
  // 动态生成 className
  const nameGenerator = () => {
    let className = ''
    const length = 2 + Math.ceil(Math.random() * 7)
    const dict = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'g',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ]
    for (let i = 0; i < length; i++) {
      className += dict[Math.ceil(Math.random() * 26 - 1)] || 'a'
    }
    return className
  }
  const elementAttributeName = nameGenerator()
	// 生成水印的样式
  const handleAddWaterMark = (str, element) => {
    const rotate = -25
    const fontWeight = 'normal'
    const fontSize = '14px'
    const fontFamily = 'SimHei'
    const fontColor = color
    const rect = {
      width: 370,
      height: 300,
      left: 10,
      top: 150
    }
    const can = document.createElement('canvas')
    can.className = 'mark-canvas'
    const watermarkDiv = element
    watermarkDiv.appendChild(can)
    can.width = rect.width
    can.height = rect.height
    can.style.display = 'none'
    can.style.zIndex = '999'
    const can2D = can.getContext('2d')
    can2D.rotate((rotate * Math.PI) / 180)
    can2D.font = `${fontWeight} ${fontSize} ${fontFamily}`
    can2D.fillStyle = fontColor
    can2D.textAlign = 'center'
    can2D.textBaseline = 'middle'
    can2D.fillText(str, rect.left, rect.top)
    // 使用 canvas 生成图片
    const styleStr = `z-index: 9;
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      pointer-events: none;
                      background-repeat: repeat;
                      background-position: 0px 0px;
                      background-image: url(${can.toDataURL('image/png')});
                      visibility: visible !important;`
    watermarkDiv.setAttribute('style', styleStr)
    // 生成之后删除多余的 canvas 元素
    const canvasDom = document.querySelector('.mark-canvas')
    if (canvasDom) {
      canvasDom.parentElement.removeChild(canvasDom)
    }
  }
  // 监听删除水印
  const containObserver = () => {
    const bodyObserver = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((_target) => {
            if (_target.className === elementAttributeName) {
              createWaterDom(document.querySelector(`#${mountElement}`))
            }
          })
        }
      })
    })
    bodyObserver.observe(document.querySelector(`#${mountElement}`), {
      childList: true
    })
    return bodyObserver
  }
  // 生成水印
  const createWaterDom = (element, containMutationObserver) => {
    let dom = document.createElement('div')
    dom.className = elementAttributeName
    element.appendChild(dom)
    handleAddWaterMark(_text, document.querySelector(`.${elementAttributeName}`))
    // 监听随机生成的类名
    if (containMutationObserver) {
      let classNameObserver = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
          if (mutation.type === 'attributes' && containMutationObserver !== null) {
            containMutationObserver.disconnect()
            dom.parentElement && dom.parentElement.removeChild(dom)
            createWaterDom(document.querySelector(`#${mountElement}`))
            containMutationObserver.observe(document.querySelector(`#${mountElement}`), {
              childList: true
            })
          }
        })
      })
      classNameObserver.observe(dom, {
        attributes: true,
        childList: true
      })
    }
  }
  React.useEffect(() => {
    const containMutationObserver = containObserver()
    createWaterDom(document.querySelector(`#${mountElement}`), containMutationObserver)
  }, [mountElement])
}

export const WatermarkComp = () => {
  return (
    <div className="App relative h-[800px] w-full overflow-hidden" id="App">
      <Watermark text="这里是一个水印这里是一个水印这里是一个水印" mountElement="App" color="#d23669" />
    </div>
  )
}

<WatermarkComp />
