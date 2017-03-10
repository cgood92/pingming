import Rx from 'rxjs/Rx';

export const keyChange$ = Rx.Observable
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
