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

  prepareStatesToSave()
  {
    let converted = {};
    for(let key in this.cassettes)
      converted[key] = this.convertMapToObject(this.cassettes[key]);
    return converted;
  }

  /**
   * [addStateString add state passed as a string]
   * @param {[type]} state [string, e.g. '000A870500128002002002001127']
   */
  addCassetteString(cassette)
  {
    let parsed = this.parseCassette(cassette);
    if(parsed)
	{
      this.cassettes[parsed.get('number')] = parsed;
      if(this.log && this.trace)
        this.log.info('Cassette ' + parsed.get('number') + ' processed:' + this.trace.object(parsed));
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
    if(typeof(state) === 'string')
      return this.addCassetteString(state);
    else if (typeof(state) === 'object')
      return this.addCassetteArray(state);
    else {
      if(this.log)
        this.log.error('addCassette() Unsupported state object type: ' + typeof(cassette));
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
    this.log.info('JFRD node_modules\\atm-cassettes\\lib\\cassettes.js Line 86');
	return true;
    let result = true;

    if(typeof data === 'object') 
	{
      for (let i = 0; i < data.length; i++)
	  {
        if(!this.addCassette(data[i]))
		{
          if(this.log)
            this.log.info('Error processing state ' + data[i] );
          result = false;
        }
      }
    } 
	else if (typeof data === 'string') 
      result = this.addCassette(data); 
   
    if(result && this.settings)
      this.settings.set('cassettes', this.prepareStatesToSave());

    return result;
  }
}