import React from 'react'

function getColors(input, led) {
    return new Promise((resolve, reject) => {

        // * Biblioteca para converter hex em hsl
        var hexToHsl = require('hex-to-hsl');

        // * Transformamos a cor em HSL para melhor manuseio e criamos sua versão escura
        const hex = led.getAttribute('fill')

        var hsl

        if (hex.length < 8) {
            // * Fill é um HEX
            hsl = hexToHsl(hex)
        } else {
            // * Fill é um HSL
            hsl = hex
            hsl = hsl.slice(4, -1).split(',')
            hsl[1] = hsl[1].slice(0, -1)
            hsl[2] = hsl[2].slice(0, -1)
        }

        if (hsl[2] > 35) {
            // * A cor atual é clara
            var darkHsl = `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) - 35}%)`
            hsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`
        } else {
            // * A cor atual é escura
            var darkHsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`
            hsl = `hsl(${hsl[0]},${hsl[1]}%,${parseInt(hsl[2]) + 35}%)`
        }

        var color
        if (input === 0) {
            color = darkHsl
        } else if (input === 1) {
            color = hsl
        }

        if (true) {
            resolve(color)
        } else {
            reject('Erro na função changeColor')
        }

    })
}

export async function changeColor(input, svgElementId) {

    try {
        //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
        var led = document.getElementById(svgElementId).querySelector('#color_path32')

        //Selecione as devidas cores em HEX
        var onColor = '#e60000'
        var offColor = '330000'

        if (input) {
            led.setAttribute('fill', onColor)
        } else {
            led.setAttribute('fill', offColor)
        }

        var output = {
            state: input
        }

        return output

    } catch (err) {
        console.log(err)
    }
}


export async function rotateComponent(input, svgElementId) {

    try {
        //Troque o 'SelectedId' pelo Id correspondente do componente que você deseja rotacionar
        var rotateC = document.getElementById(svgElementId).querySelector('#SelectedId')

        // Modifique o codigo dentro dessa area
        rotateC.style.setProperty('rotate', '10px')
        rotateC.style.setProperty('transform-origin', '0 0')

        var output = {
            state: input
        }
        // 

        return output

    } catch (err) {
        console.log(err)
    }
}


export async function moveComponent(input, svgElementId) {

    try {
        //Troque o 'SelectedId' pelo Id correspondente do componente que você deseja rotacionar
        var rotateC = document.getElementById(svgElementId).querySelector('#SelectedId')

        // Modifique o codigo dentro dessa area
        rotateC.style.setProperty('translate', '0px')

        var output = {
            state: input
        }
        // 

        return output

    } catch (err) {
        console.log(err)
    }
}