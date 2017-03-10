import Rx from 'rxjs/Rx';

import MoveableObject from './MoveableObject'

export default class Shot extends MoveableObject {
	constructor(letter, left, game) {
		super(null, left, 100)
		this.game = game
		this.domRepresentation = this.createDom(letter)
		this.fire()
	}

	createDom = letter => {
		const bullet = document.createElement("p");
		bullet.classList.add('bullet')
		bullet.innerHTML = letter
		bullet.style.left = `${this.left}%`
		document.querySelector('.field').appendChild(bullet)
		return bullet
	}

	fire = () => {
		const observer = Rx.Observable
			.interval(20)
			.scan(acc => acc-1, this.top)
			.takeWhile(top => top > -10)
			.subscribe(top => {
				this.top = top
				this.render()
				if (this.isCollidingWith(this.game.ming)) {
					observer.unsubscribe()
					this.die()
				}
			})
	}

	die = () => {
		this.game.die()
		document.querySelector('.field').removeChild(this.domRepresentation)
	}
}
