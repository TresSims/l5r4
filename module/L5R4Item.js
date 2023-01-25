export default class L5R4Item extends Item {
  chatTemplate = {
    "weapon": "systems/l5r4/templates/partials/weapon-card.hbs",
    "bow": "systems/l5r4/templates/partials/weapon-card.hbs",
    "skill": "systems/l5r4/templates/partials/skill-card.hbs",
    "armor": "systems/l5r4/templates/partials/armor-card.hbs",
    "spell": "systems/l5r4/templates/partials/spell-card.hbs",
    "technique": "systems/l5r4/templates/partials/technique-card.hbs",
    "advantage": "systems/l5r4/templates/partials/advantage-card.hbs",
    "disadvantage": "systems/l5r4/templates/partials/disadvantage-card.hbs",
    "kata": "systems/l5r4/templates/partials/kata-card.hbs",
    "kiho": "systems/l5r4/templates/partials/kiho-card.hbs",
  };

  prepareData() {
    super.prepareData();

    let itemData = this.data;
    let data = itemData.data;

    // get damage from arrows for bows
    if (itemData.type == "bow") {
      let actorData;
      let actorStr = 0;
      // get pc str
      if (this.actor) {
        if (this.actor.data) {
          actorData = this.actor.data.data;
          actorStr = parseInt(actorData.traits.str);
        }
      }
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
      data.damageRoll = Math.min(parseInt(data.str), actorStr) + arrowRoll;
      data.damageKeep = arrowKeep;
      data.damageFormula = `${data.damageRoll}k${data.damageKeep}`;
    }


  }

  async roll() {
    const item = this;
    let cardData = item.data;
    
    // Initialize chat data.
    let content = await renderTemplate(this.chatTemplate[this.type], cardData);
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}]`;

    // send a chat message.

    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
      content: content ?? ''
    });

  }
}