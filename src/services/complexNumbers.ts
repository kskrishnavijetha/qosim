
export class Complex {
  constructor(public real: number, public imaginary: number) {}

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imaginary + other.imaginary);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imaginary);
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  phase(): number {
    return Math.atan2(this.imaginary, this.real);
  }
}
