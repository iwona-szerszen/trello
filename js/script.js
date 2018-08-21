(function(){

	document.addEventListener('DOMContentLoaded', function() {

		function randomString() {
			const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
			let str = '';

			for (let i = 0; i < chars.length; i++) {
				str += chars[Math.floor(Math.random() * chars.length)];
			}

			return str;
		}

		function generateTemplate(name, data, basicElement) {
			const template = document.getElementById(name).innerHTML;
			const element = document.createElement(basicElement || 'div');

			Mustache.parse(template);
			element.innerHTML = Mustache.render(template, data);

			return element;
		}

		function initSortable(id) {
			const el = document.getElementById(id);
			const sortable = Sortable.create(el, {
				group: 'kanban-cards',
				sort: true
			});
		}

		function Column(name) {
			const self = this;

			this.id = randomString();
			this.name = name;
			this.element = generateTemplate('column-template', {name: this.name, id: this.id});

			this.element.querySelector('.column').addEventListener('click', function(event) {
				if (event.target.classList.contains('btn-delete')) {
					self.removeColumn();
				}
				if (event.target.classList.contains('add-card')) {
					self.addCard(new Card(prompt('Enter the name of the card:')));
				}
			})
		};

		Column.prototype = {
			addCard: function(card) {
				this.element.querySelector('ul').appendChild(card.element);
			},
			removeColumn: function() {
				this.element.parentNode.removeChild(this.element);
			}
		};

		function Card(description) {
			const self = this;

			this.id = randomString();
			this.description = description;
			this.element = generateTemplate('card-template', {description: this.description}, 'li');

			this.element.querySelector('.card').addEventListener('click', function(event) {
				event.stopPropagation();
				if (event.target.classList.contains('btn-delete')) {
					self.removeCard();
				}
			});
		}

		Card.prototype = {
			removeCard: function() {
				this.element.parentNode.removeChild(this.element);
			}
		};

		const board = {
			name: 'Kanban Board',
			element: document.querySelector('#board .column-container'),
			addColumn: function(column) {
				this.element.appendChild(column.element);
				initSortable(column.id);
			}
		};

		// initiating Sortable on the board so that the columns could be dragged & dropped
		Sortable.create(board.element, {
			group: 'kanban-columns',
			sort: true
		});
		
		document.querySelector('#board .create-column').addEventListener('click', function() {
			const name = prompt('Enter a column name:');
			const column = new Column(name);
			board.addColumn(column);
		});

		const toDoColumn = new Column('To Do');
		const doingColumn = new Column('Doing');
		const doneColumn = new Column('Done');

		board.addColumn(toDoColumn);
		board.addColumn(doingColumn);
		board.addColumn(doneColumn);

		const toDoTasks = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

		for (let i = 0; i < toDoTasks.length; i++) {
			toDoColumn.addCard(new Card(toDoTasks[i] + ' task assigned to To Do column'));
		}

		doingColumn.addCard(new Card('Create kanban board'));

	});

})();