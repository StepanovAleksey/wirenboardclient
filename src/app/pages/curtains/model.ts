export class Group {
    isSelected = false
    constructor(public name: string, public curtains: Array<Curtain>) { }
}

export class Curtain {
    isSelected = false
    position = (Math.random() * 100).toFixed(0);
    constructor(public adress: number) { }
}