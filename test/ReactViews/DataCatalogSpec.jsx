import CatalogGroup from '../../lib/Models/CatalogGroup';
import DataCatalogMember from '../../lib/ReactViews/DataCatalog/DataCatalogMember';
import DataCatalog from '../../lib/ReactViews/DataCatalog/DataCatalog';
import {findAllWithType} from 'react-shallow-testutils';
import {getShallowRenderedOutput} from './MoreShallowTools';
import React from 'react';
import Terria from '../../lib/Models/Terria';
import ViewState from '../../lib/ReactViewModels/ViewState';

describe('DataCatalog', function() {
    let terria;
    let viewState;

    beforeEach(function() {
        terria = new Terria({
            baseUrl: './'
        });
        viewState = new ViewState({
            terria: terria
        });
    });

    it('does not show the user-added data group', function() {
        const someGroup = new CatalogGroup(terria);
        someGroup.name = 'Some Group';
        terria.catalog.userAddedDataGroup.add(someGroup);

        const anotherGroup = new CatalogGroup(terria);
        anotherGroup.name = 'Another Group';
        terria.catalog.group.add(anotherGroup);

        const tab = <DataCatalog terria={terria} viewState={viewState} items={terria.catalog.group.items}/>;
        const result = getShallowRenderedOutput(tab);
        const memberComponents = findAllWithType(result, DataCatalogMember);

        let foundAnotherGroup = false;
        memberComponents.forEach(member => {
            expect(member.props.member).not.toBe(terria.catalog.userAddedDataGroup);
            expect(member.props.member.name).not.toEqual('User-Added Data');
            foundAnotherGroup = foundAnotherGroup || member.props.member === anotherGroup;
        });

        expect(foundAnotherGroup).toBe(true);
    });
});
