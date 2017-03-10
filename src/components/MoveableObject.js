export default class MoveableObject {
	constructor(domRepresentation, left = 0, top = 0) {
		this.left = left
		this.top = top
		this.domRepresentation = domRepresentation

		if (this.domRepresentation) {
			this.render()
		}
	}

	keepInBounds = (oldVal, newVal, bufferSpace) => {
		if (newVal + bufferSpace > 100 || newVal < 0) {
			return oldVal
		}
		return newVal
	}

	isCollidingWith = (otherDomRepresentation) => {
		const myDom = this.domRepresentation
		const otherDom = otherDomRepresentation.domRepresentation
		return (
			// Within the x-axis
			myDom.offsetLeft > otherDom.offsetLeft &&
			myDom.offsetLeft < otherDom.offsetLeft + otherDom.offsetWidth &&
			// Within the y-axis
			myDom.offsetTop > otherDom.offsetTop &&
			myDom.offsetTop < otherDom.offsetTop + otherDom.offsetHeight
			)
	}

	render() {
		this.domRepresentation.style.left = `${this.left}%`
		this.domRepresentation.style.top = `${this.top}%`
	}
}
