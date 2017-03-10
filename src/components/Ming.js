import Rx from 'rxjs/Rx';

import MoveableObject from './MoveableObject'

export default class Ming extends MoveableObject {
	constructor(game) {
		super(document.querySelector('.ming'), 50, 50)
		this.game = game

		this.randomlyMoveObserver = this.randomlyMove()
	}

	randomNum = (min, max) => (Math.random() * (max - min) + min)

	randomInt = (min, max) => {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	randomlyMove = () =>
		Rx.Observable
			.interval(2000)
			.subscribe(() => this.changeDirection())

	changeDirection = () => {
		this.left = this.randomNum(0, 100)
		this.top = this.randomNum(0, 100)
		this.render()
	}

	die = () => {
		this.randomlyMoveObserver.unsubscribe()
		this.left = null
		this.top = null
		this.render()

		this.domRepresentation.classList.add('dead')

		setTimeout(() => this.game.showMenu(), 1000)
	}

	reset = () => {
		this.left = 50
		this.top = 50
		this.domRepresentation.classList.remove('dead')
		this.randomlyMoveObserver = this.randomlyMove()
		this.render()
	}
}
