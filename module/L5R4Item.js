export default class LF54Item extends Item {
  chatTemplate = {
    "weapon": "systems/l5r4/templates/chat/weapon-chat.hbs",
    "skill": "systems/l5r4/templates/partials/skill-card.hbs",
    "armor": "systems/l5r4/templates/partials/armor-card.hbs",
    "spell": "systems/l5r4/templates/partials/spell-card.hbs"
  };

  prepareData() {
    super.prepareData();

    let itemData = this.data;
    let data = itemData.data;

    // get damage from arrows for bows
    if (itemData.type == "bow") {
      let arrowRoll = 0;
      let arrowKeep = 0;
      let arrow = game.i18n.localize(`l5r4.arrows.${data.arrow}`);
      switch (arrow) {
        case game.i18n.localize("l5r4.arrows.armor"):
          arrowRoll = 1;
          arrowKeep = 1;
          break;
        case game.i18n.localize("l5r4.arrows.flesh"):
          arrowRoll = 2;
          arrowKeep = 3;
          break;
        case game.i18n.localize("l5r4.arrows.humming"):
          arrowRoll = 0;
          arrowKeep = 1;
          break;
        case game.i18n.localize("l5r4.arrows.rope"):
          arrowRoll = 1;
          arrowKeep = 1;
          break;
        case game.i18n.localize("l5r4.arrows.willow"):
          arrowRoll = 2;
          arrowKeep = 2;
          break;
      }
      data.damageRoll = parseInt(data.str) + arrowRoll;
      data.damageKeep = arrowKeep;
      data.damageFormula = `${data.damageRoll}k${data.damageKeep}`;
    }
    
    
  }

  async roll() {
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker()
    };

    let cardData = {
      ...this.data,
      owner: this.actor.id
    };

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true; //revise later

    return ChatMessage.create(chatData);
  }
}