import Rx from 'rxjs/Rx';

import MoveableObject from './MoveableObject'
import Shot from './Shot'

import { keyChange$ } from '../util/common'

export default class Ship extends MoveableObject {
	constructor(ming) {
		super(document.getElementById('ship'), 50, 0)
		this.ming = ming

		// Setup listeners
		this.listenToMoveShip()
		this.listenToFire()
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

	listenToMoveShip = () =>
			keyChange$
				.map(this.convertLeftRightToInt)
				.filter(change => change !== 0)
				.scan((acc, change) => this.keepInBounds(acc, (acc+change), 10), this.left)
				.subscribe(left => {
					this.left = left
					this.render()
				})

	isAFireKey = code => [13, 32, 38].indexOf(code) !== -1

	listenToFire = () => {
		let cycle = -1
		const letters = 'PING'.split('')
		keyChange$
			.filter(this.isAFireKey)
			.throttle(() => Rx.Observable.interval(200))
			.subscribe(() => {
				if (cycle >= letters.length - 1) {
					cycle = -1
				}
				cycle++
				new Shot(letters[cycle], this.left, this.ming)
			})
	}
}
