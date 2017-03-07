import styles from './styles.scss'
import Rx from 'rxjs/Rx';

const keyChange$ = Rx.Observable
	.create(observer => {
		const map = {}
		const handle = e => {
			map[e.keyCode] = (e.type === 'keydown')
		}
		document.body.addEventListener('keydown', handle)
		document.body.addEventListener('keyup', handle)
		Rx.Observable
			.interval(30)
			.subscribe(() =>
								Object
								.keys(map)
								.filter(i => map[i] === true)
								.map(i => observer.next(Number(i)))
								)
	})

class MoveableObject {
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

class Ship extends MoveableObject {
	constructor() {
		super(document.getElementById('ship'), 50, 0)

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
				.map(keyCode => this.convertLeftRightToInt(keyCode))
				.filter(change => change !== 0)
				.scan((acc, change) => this.keepInBounds(acc, (acc+change), 10), this.left)
				.subscribe(left => {
					this.left = left
					this.render()
				})

	listenToFire = () => {
		let cycle = -1
		const letters = 'PING'.split('')
		keyChange$
			.filter(code => code === 38)
			.throttle(() => Rx.Observable.interval(200))
			.subscribe(() => {
				if (cycle >= letters.length - 1) {
					cycle = -1
				}
				cycle++
				new Shot(letters[cycle], this.left)
			})
	}
}

class Shot extends MoveableObject {
	constructor(letter, left) {
		super(null, left, 100)
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
				if (this.isCollidingWith(ming)) {
					observer.unsubscribe()
					this.die()
				}
			})
	}

	die = () => {
		ming.die()
		document.querySelector('.field').removeChild(this.domRepresentation)
	}
}

class Ming extends MoveableObject {
	constructor() {
		super(document.querySelector('.ming'), 50, 50)
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

		setTimeout(() => game.showMenu(), 1000)
	}

	reset = () => {
		this.left = 50
		this.top = 50
		this.domRepresentation.classList.remove('dead')
		this.randomlyMoveObserver = this.randomlyMove()
		this.render()
	}
}

class Game {
	constructor() {
		this.menu = document.getElementById('menu')
		document.getElementById('newGame').addEventListener('click', this.start)
	}

	showMenu = () => {
		this.menu.classList.remove('hidden')
	}

	hideMenu = () => {
		this.menu.classList.add('hidden')
	}

	start = () => {
		this.hideMenu()
		ming.reset()
	}
}

let game = new Game()
let ming = new Ming()
let ship = new Ship()
