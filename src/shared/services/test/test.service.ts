import { Signal, signal } from '@preact/signals-react';

export default class TestService {
	private foo: Signal<number> = signal<number>(0);

	getFoo(): number {
		return this.foo.value;
	}

	setFoo(value: number): void {
		this.foo.value = value;
	}
}
