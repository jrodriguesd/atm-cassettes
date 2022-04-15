class CassettesService
{
  constructor(settings, log, trace)
  {
    this.settings = settings;
    this.log = log;
    this.trace = trace;

    if(!this.cassettes)
      this.cassettes = {};
  }

  parseCassette(cassette)
  {
      this.log.info('JFRD node_modules\\atm-cassettes\\lib\\cassettes.js parseCassette 15');
      let parsed = new Map();
	  let position = cassette.substr(2, 1);
      parsed.set('currency_type', cassette.substr(0, 2));
      parsed.set('position',      position);
      parsed.set('denomination',  cassette.substr(3, 5));
      parsed.set('remaining',     11 * parseInt( position ) );
      parsed.set('rejected',      0);
      parsed.set('dispensed',     0);
      parsed.set('last_trxn_dispensed', 0);

	  // parsed = null;
	  return parsed;
  }

  convertMapToObject(map_cassette)
  {
    let object_cassette = {};
    for(let [key, value] of map_cassette)
      if(value instanceof Set)
	  {
        // Converting Set to Array
        let array = [];
        for (let i of value)
          array.push(i);
        object_cassette[key] = array;
      } 
	  else 
	  {
        object_cassette[key] = value;
      }


    return object_cassette;
  }

  prepareCassettesToSave()
  {
    let converted = {};
    for(let key in this.cassettes)
      converted[key] = this.convertMapToObject(this.cassettes[key]);
    return converted;
  }

  /**
   * [addCassetteString add cassette passed as a string]
   * @param {[type]} cassette [string, e.g. '01100010']
   */
  addCassetteString(cassette)
  {
    let parsed = this.parseCassette(cassette);
    if(parsed)
	{
      this.cassettes[parsed.get('position')] = parsed;
      if(this.log && this.trace)
        this.log.info('Cassette ' + parsed.get('position') + ' processed:' + this.trace.object(parsed));
      return true;
    } 
	else
      return false;
  }


  /**
   * [addCassette description]
   * @param {[type]} cassette [description]
   * @return {boolean}     [true if cassette was successfully added, false otherwise]
   */
  addCassette(cassette)
  {
    if(typeof(cassette) === 'string')
      return this.addCassetteString(cassette);
    else if (typeof(cassette) === 'object')
      return this.addCassetteArray(cassette);
    else {
      if(this.log)
        this.log.error('addCassette() Unsupported cassette object type: ' + typeof(cassette));
      return false;
    }
  }

  /**
   * [add description]
   * @param {[type]} data [array of data to add]
   * @return {boolean}     [true if data were successfully added, false otherwise]
   */
  add(data)
  {
    let result = true;

    if(typeof data === 'object') 
	{
      for (let i = 0; i < data.length; i++)
	  {
        if(!this.addCassette(data[i]))
		{
          if(this.log)
            this.log.info('Error processing cassette ' + data[i] );
          result = false;
        }
      }
    } 
	else if (typeof data === 'string') 
      result = this.addCassette(data); 
   
    if(result && this.settings)
      this.settings.set('cassettes', this.prepareCassettesToSave());

    return result;
  }
}

module.exports = CassettesService;
