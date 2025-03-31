class Dialogue {
  constructor(text, color) {
    this.text = text;
    this.color = color;
  }
}

class StageDirections extends Dialogue {
  constructor(direction) {
    super(direction, "ash-gray");
  }
}

class Character extends Dialogue {
  constructor(name, text, color) {
    super(text, color);
    this.name = name;
  }
}