"use strict";

class CultsBoonsPage extends ListPage {
	constructor () {
		const sourceFilter = SourceFilter.getInstance();
		const typeFilter = new Filter({
			header: "Type",
			items: ["Boon, Demonic", "Cult"]
		});

		super({
			dataSource: "data/cultsboons.json",

			filters: [
				sourceFilter,
				typeFilter
			],
			filterSource: sourceFilter,

			listClass: "cultsboons",

			sublistClass: "subcultsboons",

			dataProps: ["cult", "boon"]
		});

		this._sourceFilter = sourceFilter;
		this._typeFilter = typeFilter;
	}

	getListItem (it, bcI, isExcluded) {
		it._fType = it.__prop === "cult" ? "Cult" : it.type ? `Boon, ${it.type}` : "Boon";

		if (!isExcluded) {
			// populate filters
			this._sourceFilter.addItem(it.source);
			this._typeFilter.addItem(it._fType);
		}

		it._lType = it.__prop === "cult" ? "Cult" : "Boon";
		it._lSubType = it.type || "\u2014";

		const eleLi = document.createElement("li");
		eleLi.className = `row ${isExcluded ? "row--blacklisted" : ""}`;

		const source = Parser.sourceJsonToAbv(it.source);
		const hash = UrlUtil.autoEncodeHash(it);

		eleLi.innerHTML = `<a href="#${hash}" class="lst--border">
			<span class="col-2 text-center pl-0">${it._lType}</span>
			<span class="col-2 text-center">${it._lSubType}</span>
			<span class="bold col-6">${it.name}</span>
			<span class="col-2 text-center ${Parser.sourceJsonToColor(it.source)} pr-0" title="${Parser.sourceJsonToFull(it.source)}" ${BrewUtil.sourceJsonToStyle(it.source)}>${source}</span>
		</a>`;

		const listItem = new ListItem(
			bcI,
			eleLi,
			it.name,
			{
				hash,
				source,
				type: it._lType,
				subType: it._lSubType
			},
			{
				uniqueId: it.uniqueId ? it.uniqueId : bcI,
				isExcluded
			}
		);

		eleLi.addEventListener("click", (evt) => this._list.doSelect(listItem, evt));
		eleLi.addEventListener("contextmenu", (evt) => ListUtil.openContextMenu(evt, this._list, listItem));

		return listItem;
	}

	handleFilterChange () {
		const f = this._filterBox.getValues();
		this._list.filter(item => {
			const cb = this._dataList[item.ix];
			return this._filterBox.toDisplay(
				f,
				cb.source,
				cb._fType
			);
		});
		FilterBox.selectFirstVisible(this._dataList);
	}

	getSublistItem (it, pinId) {
		const hash = UrlUtil.autoEncodeHash(it);

		const $ele = $(`<li class="row">
			<a href="#${hash}" class="lst--border">
				<span class="col-2 text-center pl-0">${it._lType}</span>
				<span class="col-2 text-center">${it._lSubType}</span>
				<span class="bold col-8 pr-0">${it.name}</span>
			</a>
		</li>`)
			.contextmenu(evt => ListUtil.openSubContextMenu(evt, listItem));

		const listItem = new ListItem(
			pinId,
			$ele,
			it.name,
			{
				hash,
				type: it._lType,
				subType: it._lSubType
			}
		);
		return listItem;
	}

	doLoadHash (id) {
		const it = this._dataList[id];

		$("#pagecontent").empty().append(RenderCultsBoons.$getRenderedCultBoon(it));

		ListUtil.updateSelected();
	}

	async pDoLoadSubHash (sub) {
		sub = this._filterBox.setFromSubHashes(sub);
		await ListUtil.pSetFromSubHashes(sub);
	}
}

const cultsBoonsPage = new CultsBoonsPage();
window.addEventListener("load", () => cultsBoonsPage.pOnLoad());
