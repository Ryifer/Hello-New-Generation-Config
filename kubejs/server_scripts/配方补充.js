ServerEvents.recipes(event => {

 const { create } = event.recipes

event.shaped(
  Item.of('synaxis:controller_wire_cable'), 
  [
    ' A ',
    'ABA', 
    ' A '
  ],
  {
    A: 'minecraft:redstone',
    B: 'create:attribute_filter'
  }
)

 create.sequenced_assembly(
      // Outputs:
       'synaxis:tweakerminal',
      // Input:
      'powergrid:conductive_casing', 
      // Sequence:
      [
        // The transitional item set by `transitionalItem('create:incomplete_large_cogwheel')` is the item used during the intermediate stages of the assembly
        // Like a normal recipe function, it's used as a sequence step in this array. Input and output have the transitional item
        create.deploying('powergrid:conductive_casing', ['powergrid:conductive_casing', 'powergrid:integrated_circuit']),
        create.deploying('powergrid:conductive_casing', ['powergrid:conductive_casing', 'powergrid:regulator_tube']),
        create.deploying('powergrid:conductive_casing', ['powergrid:conductive_casing', 'powergrid:vfet']),
        create.deploying('powergrid:conductive_casing', ['powergrid:conductive_casing', 'powergrid:bjt_npn']),
      ]
    )
    .transitionalItem('powergrid:conductive_casing') // Set the transitional item
    .loops(1) // Set the number of loops

    event.shaped(
  Item.of('synaxis:propeller_blade'), 
  [
    ' AD',
    'ABC', 
    ' AD'
  ],
  {
    A: 'create:white_sail',
    B: 'create:brass_casing',
    C:'create:shaft',
    D:'minecraft:redstone'
  }
)

})