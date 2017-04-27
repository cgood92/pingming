import Rx from 'rxjs/Rx';

import MoveableObject from './MoveableObject'
import Shot from './Shot'

import { keyChange$, clickChange$ } from '../util/common'

export default class Ship extends MoveableObject {
	constructor(game) {
		super(document.getElementById('ship'), 50, 0)
		this.game = game

		// Setup listeners
		this.subscribe()
	}

	subscribe = () => {
		this.observables = [this.listenToMoveShip(), this.listenToFire()]
	}

	unsubscribe = () => {
		this.observables.forEach($ => $.unsubscribe())
	}

	convertLeftRightToInt = code => {
		switch(code) {
			case 37:
				return -1
			case 39:
				return 1
			default:
				return 0
		}
	}

	mouse$ =
		Rx.Observable
			.fromEvent(document.body, 'mousemove')
			.map(({ clientX }) => clientX)
			.map(mouseX => mouseX * 100 / document.body.clientWidth)
			.map(percent => {
				if (percent > this.left) {
					return 1
				} else if (percent < this.left) {
					return -1
				} else {
					return 0
				}
			})

	listenToMoveShip = () => {
		const keyboard = keyChange$
			.map(this.convertLeftRightToInt)

		return Rx.Observable
			.merge(keyboard, this.mouse$)
			.filter(change => change !== 0)
			.scan((acc, change) => this.keepInBounds(acc, (acc+change), 10), this.left)
			.subscribe(left => {
				this.left = left
				this.render()
			})
	}

	getLetter = () => {
		this.cycle = this.cycle === undefined ? -1 : this.cycle
		const letters = 'PING'.split('')
		if (this.cycle >= letters.length - 1) {
			this.cycle = -1
		}
		this.cycle = this.cycle + 1
		return letters[this.cycle]
	}

	isAFireKey = code => [13, 32, 38].indexOf(code) !== -1

	listenToFire = () =>
		keyChange$
			.filter(this.isAFireKey)
			.merge(clickChange$)
			.throttle(() => Rx.Observable.interval(200))
			.subscribe(() => new Shot(this.getLetter(), this.left, this.game))

	die = () => {
		this.unsubscribe()
	}

	reset = () => {
		this.subscribe()
	}
}
