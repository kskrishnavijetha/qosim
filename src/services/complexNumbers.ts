export class Complex {
  constructor(public real: number, public imag: number) {}

  // Keep backward compatibility with 'imaginary' property
  get imaginary(): number {
    return this.imag;
  }

  set imaginary(value: number) {
    this.imag = value;
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase(): number {
    return Math.atan2(this.imag, this.real);
  }
}
