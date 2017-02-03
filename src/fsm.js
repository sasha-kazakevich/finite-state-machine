class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config) throw new Error('config is missing');
      this.config = config;
      this.state = {
        post: [],
        present: this.config.initial,
        future: []
      }

    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.state.present;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (this.config.states[state]) {
        this.state.post.push(this.state.present);
        this.state.present = state;
        this.state.future = [];
      } else throw new Error("state does not exist");

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      if (this.config.states[this.getState()].transitions[event]) {
        this.changeState(this.config.states[this.getState()].transitions[event]);
      } else throw new Error('event does not exist')

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.state.present = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if (!event) {
        return Object.keys(this.config.states);
      }
      return Object.keys(this.config.states).filter(function(el){
         return this.config.states[el].transitions[event];
      }.bind(this))
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this.state.post.length === 0) {
        return false;
      }
      this.state.future.push(this.state.present);
      this.state.present = this.state.post.pop();

      return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this.state.future.length === 0) {
        return false;
      }
      this.state.post.push(this.state.present);
      this.state.present = this.state.future.pop();

      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.state.post = [];
      this.state.future = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
